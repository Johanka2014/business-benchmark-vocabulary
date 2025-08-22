import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sheetId } = await req.json()
    
    if (!sheetId) {
      return new Response(
        JSON.stringify({ error: 'Sheet ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Google Sheets API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const range = 'A:F' // Assumes data in columns A-F
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Sheets API Error:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch data: ${response.statusText}`,
          details: errorText
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const data = await response.json()
    
    if (!data.values || data.values.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No data found in spreadsheet' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Convert Google Sheets data to CSV format
    const csvData = data.values
      .map((row: string[]) => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        csvData: csvData,
        lastUpdated: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error in fetch-vocabulary function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})