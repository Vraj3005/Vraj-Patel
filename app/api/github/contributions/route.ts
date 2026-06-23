import { NextRequest, NextResponse } from 'next/server';
import { GithubFetcher } from '@/lib/github/github-fetcher';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('account') || 'combined'; // 'combined' | 'personal' | 'academic'
    const data = await GithubFetcher.getContributions(mode);
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('Error fetching GitHub contributions:', err);
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
  }
}
