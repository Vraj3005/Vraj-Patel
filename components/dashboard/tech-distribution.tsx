'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { projects } from '@/lib/data/projects';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface TechDistributionProps {
  onSelectCategory: (category: string | null) => void;
  onSelectTech: (tech: string | null) => void;
  selectedCategory: string | null;
  selectedTech: string | null;
}

export default function TechDistribution({
  onSelectCategory,
  onSelectTech,
  selectedCategory,
  selectedTech
}: TechDistributionProps) {
  // 1. Calculate Technology frequencies
  const techMap: Record<string, number> = {};
  projects.forEach((p) => {
    p.technologies.forEach((t) => {
      techMap[t] = (techMap[t] || 0) + 1;
    });
  });

  // Sort and take top 8
  const techData = Object.entries(techMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // 2. Calculate Category counts
  const categoryMap: Record<string, number> = {};
  projects.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  // Sleek glassmorphic chart palette
  const COLORS = ['#22d3ee', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  const handleBarClick = (data: any) => {
    if (data && data.name) {
      if (selectedTech === data.name) {
        onSelectTech(null); // toggle off
      } else {
        onSelectTech(data.name);
        onSelectCategory(null); // prioritize tech filter
      }
    }
  };

  const handlePieClick = (data: any) => {
    if (data && data.name) {
      if (selectedCategory === data.name) {
        onSelectCategory(null); // toggle off
      } else {
        onSelectCategory(data.name);
        onSelectTech(null); // prioritize category filter
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Category Distribution (Pie Chart) */}
      <Card className="p-6 bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col relative z-10 select-none">
          <span className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">
            Segmentation
          </span>
          <h3 className="text-sm font-bold text-foreground font-serif tracking-tight mt-0.5">
            Projects by Category
          </h3>
        </div>

        <div className="h-64 w-full relative z-10 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {categoryData.map((entry, index) => {
                  const isSelected = selectedCategory === entry.name;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#0e0e11"
                      strokeWidth={2}
                      opacity={selectedCategory ? (isSelected ? 1 : 0.4) : 0.85}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.4))' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#ffffff', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value, entry: any) => {
                  const isSelected = selectedCategory === value;
                  return (
                    <span
                      className={`text-[10px] font-mono transition-colors cursor-pointer ${
                        isSelected ? 'text-cyan-400 font-bold' : 'text-secondary hover:text-foreground'
                      }`}
                      onClick={() => handlePieClick({ name: value })}
                    >
                      {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tech Stack Distribution (Bar Chart) */}
      <Card className="p-6 bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col relative z-10 select-none">
          <span className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">
            Frequencies
          </span>
          <h3 className="text-sm font-bold text-foreground font-serif tracking-tight mt-0.5">
            Technology Usage Frequencies
          </h3>
        </div>

        <div className="h-64 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={techData}
              layout="vertical"
              margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
            >
              <XAxis type="number" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                fontSize={9}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#9ca3af', fontSize: '10px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#22d3ee', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Bar dataKey="value" onClick={handleBarClick} className="cursor-pointer">
                {techData.map((entry, index) => {
                  const isSelected = selectedTech === entry.name;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill="#22d3ee"
                      opacity={selectedTech ? (isSelected ? 1 : 0.3) : 0.75}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.5))' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
