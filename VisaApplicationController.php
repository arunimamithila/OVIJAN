<?php

namespace App\Http\Controllers;

use App\Models\VisaApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class VisaApplicationController extends Controller
{
    public function store(Request $request)
    {
        try {
            \Log::info('Visa Application Request:', $request->all());
            
            $rules = [
                'email' => 'required|email',
                'full_name' => 'required|string|max:255',
                'date_of_birth' => 'required|date',
                'nationality' => 'required|string|max:100',
                'passport_number' => 'required|string|max:50',
                'passport_expiry_date' => 'required|date',
                'phone_number' => 'required|string|max:20',
                'home_address' => 'required|string',
                'intended_travel_date' => 'required|date',
                'visa_type' => 'required|in:student,job_seeker',
                'secure_access_code' => 'required|string|max:50',
            ];

            if ($request->visa_type === 'student') {
                $rules['university_name'] = 'required|string|max:255';
                $rules['course_name'] = 'required|string|max:255';
            } else {
                $rules['job_title'] = 'required|string|max:255';
                $rules['company_name'] = 'required|string|max:255';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle file uploads
            $acceptanceLetterPath = null;
            $jobOfferLetterPath = null;
            $proofOfFundsPath = null;

            if ($request->hasFile('acceptance_letter')) {
                $acceptanceLetterPath = $request->file('acceptance_letter')->store('visa-documents', 'public');
            }

            if ($request->hasFile('job_offer_letter')) {
                $jobOfferLetterPath = $request->file('job_offer_letter')->store('visa-documents', 'public');
            }

            if ($request->hasFile('proof_of_funds')) {
                $proofOfFundsPath = $request->file('proof_of_funds')->store('visa-documents', 'public');
            }

            // Generate application reference
            $applicationRef = 'VISA-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

            // Create application
            $application = VisaApplication::create([
                'application_reference' => $applicationRef,
                'email' => $request->email,
                'full_name' => $request->full_name,
                'date_of_birth' => $request->date_of_birth,
                'nationality' => $request->nationality,
                'passport_number' => $request->passport_number,
                'passport_expiry_date' => $request->passport_expiry_date,
                'phone_number' => $request->phone_number,
                'home_address' => $request->home_address,
                'intended_travel_date' => $request->intended_travel_date,
                'university_name' => $request->university_name,
                'course_name' => $request->course_name,
                'acceptance_letter_path' => $acceptanceLetterPath,
                'job_title' => $request->job_title,
                'company_name' => $request->company_name,
                'job_offer_letter_path' => $jobOfferLetterPath,
                'proof_of_funds_path' => $proofOfFundsPath,
                'has_criminal_record' => $request->has_criminal_record == '1' || $request->has_criminal_record == true,
                'has_visa_refusal' => $request->has_visa_refusal == '1' || $request->has_visa_refusal == true,
                'selected_country_id' => $request->selected_country_id,
                'selected_country_name' => $request->selected_country_name,
                'visa_type' => $request->visa_type,
                'application_status' => 'pending',
                'submitted_at' => now(),
                'agree_terms' => true,
                'agree_accuracy' => true,
                'secure_access_code' => $request->secure_access_code,
            ]);

            \Log::info('Application saved successfully', ['id' => $application->id]);

            return response()->json([
                'success' => true,
                'message' => 'Application submitted successfully',
                'data' => [
                    'application_reference' => $application->application_reference,
                    'application_status' => $application->application_status,
                    'submitted_at' => $application->submitted_at,
                    'secure_access_code' => $application->secure_access_code
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Visa Application Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function track(Request $request)
{
    $validator = Validator::make($request->all(), [
        'passport_number' => 'required|string',
        'access_code' => 'required|string'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    $application = VisaApplication::where('passport_number', $request->passport_number)
        ->where('secure_access_code', $request->access_code)
        ->first();

    if (!$application) {
        return response()->json([
            'success' => false,
            'message' => 'No application found with the provided passport number and access code'
        ], 404);
    }

    // Get timeline steps based on application status
    $timelineSteps = $this->getTimelineSteps($application);

    return response()->json([
        'success' => true,
        'data' => [
            'application' => $application,
            'timeline' => $timelineSteps,
            'stats' => $this->getProgressStats($application, $timelineSteps)
        ]
    ]);
}

private function getTimelineSteps($application)
{
    $submittedDate = $application->submitted_at ? new \DateTime($application->submitted_at) : new \DateTime();
    $status = $application->application_status;
    $visaType = $application->visa_type;
    
    // Define all possible steps based on visa type
    if ($visaType === 'student') {
        $allSteps = [
            ['id' => 1, 'title' => 'Application Submitted', 'description' => 'Your student visa application has been successfully submitted.', 'category' => 'Submission'],
            ['id' => 2, 'title' => 'Document Verification', 'description' => 'Your documents including passport, CAS letter, and financial evidence are being verified.', 'category' => 'Verification'],
            ['id' => 3, 'title' => 'CAS Verification', 'description' => 'Your Confirmation of Acceptance for Studies is being verified with the university.', 'category' => 'Verification'],
            ['id' => 4, 'title' => 'Financial Evidence Check', 'description' => 'Your financial documents are being reviewed to ensure you meet maintenance requirements.', 'category' => 'Verification'],
            ['id' => 5, 'title' => 'Biometric Appointment', 'description' => 'Schedule and attend your biometric appointment for fingerprints and photo.', 'category' => 'Biometrics'],
            ['id' => 6, 'title' => 'Credibility Interview', 'description' => 'You may be required to attend an interview to discuss your study plans.', 'category' => 'Interview'],
            ['id' => 7, 'title' => 'Background Security Check', 'description' => 'Security checks are being conducted by UK Visas and Immigration.', 'category' => 'Security'],
            ['id' => 8, 'title' => 'Decision Made', 'description' => 'A decision has been made on your visa application.', 'category' => 'Decision'],
            ['id' => 9, 'title' => 'Visa Issued', 'description' => 'Your visa has been approved and your passport is ready for collection.', 'category' => 'Completion']
        ];
    } else {
        $allSteps = [
            ['id' => 1, 'title' => 'Application Submitted', 'description' => 'Your work visa application has been successfully submitted.', 'category' => 'Submission'],
            ['id' => 2, 'title' => 'Document Verification', 'description' => 'Your documents including passport, job offer, and qualifications are being verified.', 'category' => 'Verification'],
            ['id' => 3, 'title' => 'Certificate of Sponsorship Check', 'description' => 'Your employer\'s Certificate of Sponsorship is being verified.', 'category' => 'Verification'],
            ['id' => 4, 'title' => 'Salary Threshold Check', 'description' => 'Your salary is being verified against the minimum requirements.', 'category' => 'Verification'],
            ['id' => 5, 'title' => 'English Language Check', 'description' => 'Your English language proficiency is being verified.', 'category' => 'Verification'],
            ['id' => 6, 'title' => 'Biometric Appointment', 'description' => 'Schedule and attend your biometric appointment for fingerprints and photo.', 'category' => 'Biometrics'],
            ['id' => 7, 'title' => 'Background Security Check', 'description' => 'Security checks are being conducted by UK Visas and Immigration.', 'category' => 'Security'],
            ['id' => 8, 'title' => 'Employer Compliance Check', 'description' => 'Your employer\'s sponsor license is being verified.', 'category' => 'Verification'],
            ['id' => 9, 'title' => 'Decision Made', 'description' => 'A decision has been made on your visa application.', 'category' => 'Decision'],
            ['id' => 10, 'title' => 'Visa Issued', 'description' => 'Your visa has been approved and your passport is ready for collection.', 'category' => 'Completion']
        ];
    }
    
    // Determine which steps are completed based on application status
    $completedCount = 0;
    if ($status === 'processing') $completedCount = 2;
    elseif ($status === 'approved') $completedCount = count($allSteps);
    elseif ($status === 'rejected') $completedCount = 8;
    else $completedCount = 1; // pending
    
    // Build timeline with statuses
    $timeline = [];
    foreach ($allSteps as $index => $step) {
        $stepStatus = 'pending';
        $stepDate = null;
        
        if ($index < $completedCount) {
            $stepStatus = 'completed';
            // Calculate estimated completion date
            $stepDate = clone $submittedDate;
            $stepDate->modify('+' . ($index + 1) . ' days');
            $stepDate = $stepDate->format('d M Y');
        } elseif ($index === $completedCount && $status === 'processing') {
            $stepStatus = 'in_progress';
            $stepDate = 'In Progress';
        } else {
            $stepDate = 'Pending';
        }
        
        $timeline[] = [
            'id' => $step['id'],
            'title' => $step['title'],
            'description' => $step['description'],
            'category' => $step['category'],
            'status' => $stepStatus,
            'date' => $stepDate,
            'estimated_wait' => $index === $completedCount && $status === 'processing' ? '2-3 weeks' : null
        ];
    }
    
    return $timeline;
}

private function getProgressStats($application, $timeline)
{
    $total = count($timeline);
    $completed = count(array_filter($timeline, fn($s) => $s['status'] === 'completed'));
    $inProgress = count(array_filter($timeline, fn($s) => $s['status'] === 'in_progress'));
    $pending = $total - $completed - $inProgress;
    $percentage = $total > 0 ? round(($completed / $total) * 100) : 0;
    
    return [
        'total' => $total,
        'completed' => $completed,
        'in_progress' => $inProgress,
        'pending' => $pending,
        'percentage' => $percentage
    ];
}

    public function show($reference)
    {
        $application = VisaApplication::where('application_reference', $reference)->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $application
        ]);
    }

    public function getByEmail($email)
    {
        $applications = VisaApplication::where('email', $email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'application_status' => 'required|in:pending,processing,approved,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $application = VisaApplication::find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        $application->update([
            'application_status' => $request->application_status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $application
        ]);
    }
}