<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'user';
    protected $primaryKey = 'userID';
    public $timestamps = false;

    protected $fillable = [
        'name', 'dob', 'email', 'password', 'edu_info_qn',
        'phone', 'location', 'bio', 'headline', 'preferred_countries',
        'current_company', 'job_title', 'years_of_experience',
        'linkedin', 'github', 'twitter', 'profile_image', 'cover_image',
        'user_role', 'profile_completion'
    ];

    protected $hidden = ['password'];
    
    protected $casts = [
        'preferred_countries' => 'array',
    ];

    public function savedJobs()
    {
        return $this->belongsToMany(Job::class, 'saved_jobs', 'user_id', 'job_id')
                    ->withPivot('saved_date')
                    ->withTimestamps();
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skills', 'useruserID', 'skillsid')
                    ->withPivot('link_of_project', 'exprience');
    }

    public function education()
    {
        return $this->hasMany(UserEducation::class, 'user_id', 'userID');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id', 'userID');
    }

    public function likes()
    {
        return $this->hasMany(PostLike::class, 'user_id', 'userID');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'user_id', 'userID');
    }

    public function followers()
    {
        return $this->hasMany(Follower::class, 'following_id', 'userID');
    }

    public function following()
    {
        return $this->hasMany(Follower::class, 'follower_id', 'userID');
    }

    public function savedPosts()
    {
        return $this->hasMany(SavedPost::class, 'user_id', 'userID');
    }

    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class, 'user_id', 'userID');
    }

    public function workExperience()
    {
        return $this->hasMany(UserWorkExperience::class, 'user_id', 'userID');
    }

    // From second file - additional fillable fields
    // protected $fillable = [
    //     'name', 'dob', 'email', 'password', 'edu_info_qn',
    //     // New profile fields
    //     'phone', 'location', 'bio', 'headline', 'preferred_countries',
    //     'current_company', 'job_title', 'years_of_experience', 'skills',
    //     'linkedin', 'github', 'twitter', 'profile_image', 'cover_image',
    //     'user_role', 'profile_completion', 'highest_qualification'
    // ];

    // From second file - additional relationships and methods
    
    // Education relationship (already defined above, keeping as is)
    // public function education()
    // {
    //     return $this->hasMany(UserEducation::class, 'user_id', 'userID');
    // }

    // Work experience relationship (already defined above, keeping as is)
    // public function workExperience()
    // {
    //     return $this->hasMany(UserWorkExperience::class, 'user_id', 'userID');
    // }

    /**
     * Get user's exam scores (English proficiency & standardized tests)
     */
    public function exams()
    {
        return $this->hasMany(UserExam::class, 'useruserID', 'userID');
    }

    /**
     * Get user's extracurricular activities
     */
    public function extracurriculars()
    {
        return $this->hasMany(UserExtracurricular::class, 'useruserID', 'userID');
    }

    /**
     * Get user's skills (from second file - alternative implementation)
     */
    // public function skills()
    // {
    //     return $this->hasMany(UserSkill::class, 'useruserID', 'userID');
    // }

    /**
     * Get user's research papers
     */
    public function researchPapers()
    {
        return $this->hasMany(UserResearchPaper::class, 'useruserID', 'userID');
    }

    /**
     * Get user's highest education level
     */
    public function getHighestEducationAttribute()
    {
        $education = $this->education()
            ->orderByRaw("FIELD(qualification_type, 'Postgraduate', 'Undergraduate', 'Higher Secondary')")
            ->first();
        
        if (!$education) {
            return null;
        }
        
        $levelMap = [
            'Higher Secondary' => 'high_school',
            'Undergraduate' => 'bachelors',
            'Postgraduate' => 'masters',
        ];
        
        return [
            'level' => $levelMap[$education->qualification_type] ?? null,
            'cgpa' => $education->cgpa,
            'field' => $education->major_subject,
            'university' => $education->institution_name,
            'degree' => $education->degree_name,
        ];
    }

    /**
     * Get user's English proficiency tests
     */
    public function getEnglishTestsAttribute()
    {
        $englishExamIds = Exam::where('exam_type', 'english_test')
            ->pluck('id')
            ->toArray();
        
        return $this->exams()
            ->whereIn('examid', $englishExamIds)
            ->with('exam')
            ->get()
            ->map(function ($test) {
                return [
                    'id' => $test->examid,
                    'type' => $test->exam->exam_name ?? 'Unknown',
                    'score' => $test->exam_scores,
                    'document' => $test->docment,
                ];
            });
    }

    /**
     * Get user's standardized tests
     */
    public function getStandardizedTestsAttribute()
    {
        $standardExamTypes = ['undergraduate', 'graduate', 'phd'];
        
        $standardExamIds = Exam::whereIn('exam_type', $standardExamTypes)
            ->pluck('id')
            ->toArray();
        
        return $this->exams()
            ->whereIn('examid', $standardExamIds)
            ->with('exam')
            ->get()
            ->map(function ($test) {
                return [
                    'id' => $test->examid,
                    'type' => $test->exam->exam_name ?? 'Unknown',
                    'score' => $test->exam_scores,
                    'document' => $test->docment,
                ];
            });
    }

    /**
     * Get user's formatted extracurricular activities
     */
    public function getFormattedExtracurricularsAttribute()
    {
        $categories = [
            'Leadership' => ['President', 'Captain', 'Lead', 'Organizer'],
            'Volunteer' => ['Volunteer', 'Community Service', 'NGO'],
            'Competition' => ['Hackathon', 'Competition', 'Olympiad', 'Debate'],
            'Sports' => ['Sports', 'Team', 'Athletics'],
            'Club' => ['Club', 'Society', 'Association'],
            'Research' => ['Research', 'Assistant', 'Lab'],
        ];
        
        return $this->extracurriculars()
            ->with('extracurricular')
            ->get()
            ->map(function ($activity) use ($categories) {
                $activityName = $activity->extracurricular->name ?? 'Unknown';
                $category = $this->determineCategory($activityName, $categories);
                
                return [
                    'id' => $activity->extracriculuerid,
                    'name' => $activityName,
                    'category' => $category,
                    'achievement' => $this->determineAchievementLevel($activity->detail),
                    'description' => $activity->detail,
                    'document' => $activity->docment,
                ];
            });
    }

    /**
     * Get user's formatted skills
     */
    public function getFormattedSkillsAttribute()
    {
        return $this->skills()
            ->with('skill')
            ->get()
            ->map(function ($userSkill) {
                $skillName = $userSkill->skill->name ?? 'Unknown';
                
                // Determine proficiency based on experience years
                $proficiency = 'Beginner';
                if ($userSkill->exprience >= 3 && $userSkill->exprience < 5) {
                    $proficiency = 'Intermediate';
                } elseif ($userSkill->exprience >= 5) {
                    $proficiency = 'Advanced';
                }
                
                $category = $this->determineSkillCategory($skillName);
                
                return [
                    'id' => $userSkill->skillsid,
                    'name' => $skillName,
                    'category' => $category,
                    'proficiency' => $proficiency,
                    'experience_years' => $userSkill->exprience,
                    'project_link' => $userSkill->link_of_project,
                ];
            });
    }

    /**
     * Get user's formatted research papers
     */
    public function getFormattedResearchPapersAttribute()
    {
        $statusMap = [
            'Draft' => 'Project',
            'Under Review' => 'Under Review',
            'Accepted' => 'Under Review',
            'Published' => 'Published',
            'Rejected' => 'Project',
        ];
        
        return $this->researchPapers()
            ->with('researchPaper')
            ->get()
            ->map(function ($paper) use ($statusMap) {
                $researchPaper = $paper->researchPaper;
                
                return [
                    'id' => $paper->recherspaperid,
                    'title' => $paper->paper_title ?? $researchPaper->research_field ?? 'Untitled',
                    'domain' => $researchPaper->research_field ?? null,
                    'description' => $researchPaper->paper_type ?? null,
                    'link' => $paper->paper_link,
                    'status' => $statusMap[$researchPaper->publication_status ?? 'Draft'] ?? 'Project',
                    'paper_type' => $researchPaper->paper_type,
                    'publication_status' => $researchPaper->publication_status,
                    'journal_conference' => $researchPaper->journal_or_conference_name,
                ];
            });
    }

    /**
     * Calculate and update profile completion percentage
     */
    public function calculateProfileCompletion()
    {
        $completionScore = 0;
        
        // Education section (20%)
        if ($this->education()->exists()) $completionScore += 20;
        
        // English tests (15%)
        if ($this->getEnglishTestsAttribute()->count() > 0) $completionScore += 15;
        
        // Standardized tests (15%)
        if ($this->getStandardizedTestsAttribute()->count() > 0) $completionScore += 15;
        
        // Extracurriculars (15%)
        if ($this->extracurriculars()->exists()) $completionScore += 15;
        
        // Skills (15%)
        if ($this->skills()->exists()) $completionScore += 15;
        
        // Research papers (20%)
        if ($this->researchPapers()->exists()) $completionScore += 20;
        
        $this->profile_completion = $completionScore;
        $this->save();
        
        return $completionScore;
    }

    /**
     * Helper: Determine activity category
     */
    private function determineCategory($activityName, $categories)
    {
        $activityLower = strtolower($activityName);
        
        foreach ($categories as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (strpos($activityLower, strtolower($keyword)) !== false) {
                    return $category;
                }
            }
        }
        
        return 'Other';
    }

    /**
     * Helper: Determine achievement level
     */
    private function determineAchievementLevel($description)
    {
        if (empty($description)) {
            return 'Participant';
        }
        
        $descLower = strtolower($description);
        
        if (strpos($descLower, 'winner') !== false || strpos($descLower, 'first place') !== false) {
            return 'Winner';
        }
        
        if (strpos($descLower, 'leader') !== false || strpos($descLower, 'president') !== false) {
            return 'Leader';
        }
        
        if (strpos($descLower, 'organizer') !== false || strpos($descLower, 'coordinator') !== false) {
            return 'Organizer';
        }
        
        return 'Participant';
    }

    /**
     * Helper: Determine skill category
     */
    private function determineSkillCategory($skillName)
    {
        $skillLower = strtolower($skillName);
        
        $programming = ['php', 'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'laravel', 'django', 'react', 'angular', 'vue', 'node'];
        $design = ['figma', 'photoshop', 'illustrator', 'design', 'ui', 'ux', 'adobe', 'sketch', 'xd'];
        $data = ['sql', 'mysql', 'postgresql', 'mongodb', 'data', 'analytics', 'machine learning', 'ai', 'tensorflow', 'pytorch'];
        $web = ['html', 'css', 'bootstrap', 'tailwind', 'frontend', 'backend', 'full stack'];
        $business = ['management', 'leadership', 'communication', 'project management', 'agile', 'scrum'];
        
        foreach ($programming as $keyword) {
            if (strpos($skillLower, $keyword) !== false) return 'Programming';
        }
        foreach ($design as $keyword) {
            if (strpos($skillLower, $keyword) !== false) return 'Design';
        }
        foreach ($data as $keyword) {
            if (strpos($skillLower, $keyword) !== false) return 'Data Science';
        }
        foreach ($web as $keyword) {
            if (strpos($skillLower, $keyword) !== false) return 'Web Development';
        }
        foreach ($business as $keyword) {
            if (strpos($skillLower, $keyword) !== false) return 'Business';
        }
        
        return 'Other';
    }
}