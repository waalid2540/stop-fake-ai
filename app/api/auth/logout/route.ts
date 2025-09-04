import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  
  await supabase.auth.signOut()
  
  redirect('/')
}