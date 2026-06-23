import { NextRequest, NextResponse } from 'next/server';
import { GraphDataResolver } from '@/lib/visualizer/graph-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';
  const layer = (searchParams.get('layer') || 'overview') as 'overview' | 'technical' | 'recruiter';

  if (!slug) {
    return NextResponse.json({ error: 'Project slug parameter is required.' }, { status: 400 });
  }

  try {
    const graph = await GraphDataResolver.getArchitectureGraph(slug, layer);
    return NextResponse.json(graph);
  } catch (err: any) {
    console.error('API Error in /api/visualizer:', err);
    return NextResponse.json({ error: 'Failed to resolve system architecture graph.' }, { status: 500 });
  }
}
