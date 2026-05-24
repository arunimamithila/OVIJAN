<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VisaType;

class VisaTypeController extends Controller
{
    public function getByCountry($countryId)
    {
        try {
            $visaTypes = VisaType::where('countriesid', $countryId)->get();
            
            return response()->json([
                'success' => true,
                'data' => $visaTypes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch visa types'
            ], 500);
        }
    }
}