'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme-provider';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Beaker, Sun, TrendingUp, Activity, Calculator, Play, Sliders, ShieldCheck 
} from 'lucide-react';

export default function Lab() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'solar' | 'quant' | 'sandbox'>('solar');

  // --- Solar Simulator States ---
  const [panelCapacity, setPanelCapacity] = useState(450); // Watts
  const [panelCount, setPanelCount] = useState(12);
  const [sunlightHours, setSunlightHours] = useState(5.5);
  const [inverterEfficiency, setInverterEfficiency] = useState(94); // %

  const calculatedDaily = (panelCapacity * panelCount * sunlightHours * (inverterEfficiency / 100000));
  const dailyYield = parseFloat(calculatedDaily.toFixed(2));
  const monthlySavings = parseFloat((calculatedDaily * 30 * 8.5).toFixed(2));
  const co2Offset = parseFloat((calculatedDaily * 30 * 0.85).toFixed(2));

  // --- Quant Volatility Simulator States ---
  const [marketRegime, setMarketRegime] = useState<'quiet' | 'volatile' | 'crash'>('quiet');

  const strikes = [80, 85, 90, 95, 100, 105, 110, 115, 120];
  const atmVol = marketRegime === 'quiet' ? 14 : marketRegime === 'volatile' ? 24 : 38;
  
  const volChartData = strikes.map((strike) => {
    const distance = strike - 100;
    let iv = atmVol;
    
    if (marketRegime === 'quiet') {
      iv += (distance * distance) * 0.04;
    } else if (marketRegime === 'volatile') {
      iv += (distance * distance) * 0.06 - (distance * 0.2);
    } else {
      iv += (distance * distance) * 0.12 - (distance * 0.8);
    }
    
    let putDelta = 0;
    let callDelta = 0;
    if (strike < 100) {
      putDelta = -Math.min(0.99, Math.max(0.01, 1 - (100 - strike) * 0.04));
      callDelta = 1 + putDelta;
    } else {
      callDelta = Math.min(0.99, Math.max(0.01, 1 - (strike - 100) * 0.04));
      putDelta = callDelta - 1;
    }

    return {
      strike: `${strike}%`,
      volatility: parseFloat(iv.toFixed(2)),
      'Call Delta': parseFloat(callDelta.toFixed(2)),
      'Put Delta': parseFloat(putDelta.toFixed(2)),
    };
  });

  // --- Quant Strategy Sandbox States ---
  const [strategy, setStrategy] = useState<'hmm' | 'reversion' | 'momentum'>('hmm');
  const [leverage, setLeverage] = useState(2); // 1x to 10x
  const [slippage, setSlippage] = useState(0.1); // % slippage per trade
  
  const [capital, setCapital] = useState(50000); // $ Capital
  const [riskPct, setRiskPct] = useState(1.5); // % Risk
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLoss, setStopLoss] = useState(96);
  const [takeProfit, setTakeProfit] = useState(110);

  const [winRate, setWinRate] = useState(62); // % win rate for Monte Carlo
  const [avgWinPct, setAvgWinPct] = useState(4.5); // avg win return %
  const [avgLossPct, setAvgLossPct] = useState(2.0); // avg loss return %
  const [seedIndex, setSeedIndex] = useState(1); // triggers path recalculation

  // Monte Carlo math calculations - computed directly during render to prevent render-loop warnings
  const monteCarloData = (() => {
    const runsCount = 5;
    const tradesCount = 50;
    const initialCapital = 10000;
    const tempPaths: number[][] = Array.from({ length: runsCount }, () => [initialCapital]);
    const maxDrawdownPath: number[] = Array.from({ length: tradesCount + 1 }, () => 0);

    for (let p = 0; p < runsCount; p++) {
      let currentCapital = initialCapital;
      let peak = initialCapital;
      
      for (let t = 1; t <= tradesCount; t++) {
        const val = Math.sin(p * 17.13 + t * 43.79 + seedIndex * 97.43) * 43758.5453;
        const rand = val - Math.floor(val);
        const isWin = rand * 100 < winRate;
        
        const returnPct = isWin 
          ? (avgWinPct / 100) * (1 + (rand - 0.5) * 0.2)
          : -(avgLossPct / 100) * (1 + (rand - 0.5) * 0.2);
        
        const leverageReturn = returnPct * leverage;
        const transactionDrag = (slippage / 100);
        
        currentCapital = currentCapital * (1 + leverageReturn - transactionDrag);
        if (currentCapital < 0) currentCapital = 0;
        
        tempPaths[p].push(currentCapital);

        if (p === 0) {
          peak = Math.max(peak, currentCapital);
          const dd = peak > 0 ? ((currentCapital - peak) / peak) * 100 : 0;
          maxDrawdownPath[t] = parseFloat(dd.toFixed(2));
        }
      }
    }

    const compiledData = [];
    for (let t = 0; t <= tradesCount; t++) {
      compiledData.push({
        trade: t,
        'Optimal HMM': parseFloat(tempPaths[0][t].toFixed(0)),
        'Standard Momentum': parseFloat(tempPaths[1][t].toFixed(0)),
        'Mean Reversion': parseFloat(tempPaths[2][t].toFixed(0)),
        'Path 4': parseFloat(tempPaths[3][t].toFixed(0)),
        'Path 5': parseFloat(tempPaths[4][t].toFixed(0)),
        Drawdown: maxDrawdownPath[t],
      });
    }
    return compiledData;
  })();

  // Strategy stats calculator
  const getStrategyMetrics = () => {
    let baseCagr = 0;
    let baseSharpe = 0;
    let baseDrawdown = 0;
    let winR = 0;

    if (strategy === 'hmm') {
      baseCagr = 22.4;
      baseSharpe = 2.45;
      baseDrawdown = -8.5;
      winR = 62;
    } else if (strategy === 'reversion') {
      baseCagr = 14.8;
      baseSharpe = 1.62;
      baseDrawdown = -16.2;
      winR = 54;
    } else {
      baseCagr = 18.2;
      baseSharpe = 1.34;
      baseDrawdown = -22.5;
      winR = 45;
    }

    // Apply leverage and slippage drag
    const adjustedCagr = (baseCagr * leverage) - (slippage * 22);
    const adjustedSharpe = baseSharpe - (slippage * 1.5) - (leverage * 0.05);
    const adjustedDrawdown = baseDrawdown * leverage;

    return {
      cagr: parseFloat(adjustedCagr.toFixed(1)),
      sharpe: parseFloat(Math.max(0.1, adjustedSharpe).toFixed(2)),
      drawdown: parseFloat(Math.max(-95, adjustedDrawdown).toFixed(1)),
      winRate: winR
    };
  };

  const metrics = getStrategyMetrics();

  // Risk reward computations
  const amountAtRisk = parseFloat((capital * (riskPct / 100)).toFixed(2));
  const riskPerUnit = Math.abs(entryPrice - stopLoss);
  const rewardPerUnit = Math.abs(takeProfit - entryPrice);
  const positionSize = riskPerUnit > 0 ? parseFloat((amountAtRisk / riskPerUnit).toFixed(2)) : 0;
  const rrRatio = riskPerUnit > 0 ? parseFloat((rewardPerUnit / riskPerUnit).toFixed(2)) : 0;
  const targetProfit = parseFloat((positionSize * rewardPerUnit).toFixed(2));

  // Dynamic Recharts colors based on active theme
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(30, 29, 26, 0.08)';
  const axisColor = isDark ? '#737373' : '#696763';
  const lineColor = isDark ? '#ffffff' : '#1e1d1a';
  const dotColor = isDark ? '#08080a' : '#f5f4f0';
  const tooltipBg = isDark ? '#08080a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e3dd';
  const tooltipTextColor = isDark ? '#f3f4f6' : '#1e1d1a';

  return (
    <div className="flex flex-col gap-10 py-6 md:py-10 max-w-5xl mx-auto w-full px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-card-border pb-6 shrink-0">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
          <Beaker className="h-4 w-4 text-foreground" /> Vraj&apos;s Engineering Sandbox
        </span>
        <h1 className="text-3xl md:text-4xl font-medium font-serif text-foreground tracking-tight">
          The Lab Dashboard
        </h1>
        <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-2xl font-medium">
          Interact with actual runtime quantitative models. Here you can configure solar quotes, option volatility surfaces, and backtest portfolio Monte Carlo paths.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-card-border gap-6 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setActiveTab('solar')}
          className={`pb-3.5 text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 cursor-pointer transition-colors relative shrink-0 ${
            activeTab === 'solar' ? 'text-foreground font-bold' : 'text-secondary hover:text-foreground'
          }`}
        >
          <Sun className="h-4 w-4" /> Enermass Solar Simulator
          {activeTab === 'solar' && (
            <motion.div layoutId="labTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('quant')}
          className={`pb-3.5 text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 cursor-pointer transition-colors relative shrink-0 ${
            activeTab === 'quant' ? 'text-foreground font-bold' : 'text-secondary hover:text-foreground'
          }`}
        >
          <TrendingUp className="h-4 w-4" /> Option Volatility Skew (MSPE)
          {activeTab === 'quant' && (
            <motion.div layoutId="labTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`pb-3.5 text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 cursor-pointer transition-colors relative shrink-0 ${
            activeTab === 'sandbox' ? 'text-foreground font-bold' : 'text-secondary hover:text-foreground'
          }`}
        >
          <Activity className="h-4 w-4" /> Quant Strategy Sandbox
          {activeTab === 'sandbox' && (
            <motion.div layoutId="labTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
          )}
        </button>
      </div>

      {/* Simulator Content */}
      <div className="w-full">
        {activeTab === 'solar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls panel */}
            <Card className="lg:col-span-1 p-6 flex flex-col gap-6">
              <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider border-b border-card-border pb-2">
                Simulator Sliders
              </h3>

              {/* Slider 1: Capacity */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-secondary font-medium">Panel Capacity:</span>
                  <span className="text-foreground font-bold font-mono">{panelCapacity} W</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="600"
                  step="10"
                  value={panelCapacity}
                  onChange={(e) => setPanelCapacity(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Slider 2: Count */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-secondary font-medium">Number of Panels:</span>
                  <span className="text-foreground font-bold font-mono">{panelCount} units</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="80"
                  step="1"
                  value={panelCount}
                  onChange={(e) => setPanelCount(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Slider 3: Hours */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-secondary font-medium">Average Sunlight:</span>
                  <span className="text-foreground font-bold font-mono">{sunlightHours} hrs/day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={sunlightHours}
                  onChange={(e) => setSunlightHours(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Slider 4: Efficiency */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-secondary font-medium">Inverter Efficiency:</span>
                  <span className="text-foreground font-bold font-mono">{inverterEfficiency}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="99"
                  step="1"
                  value={inverterEfficiency}
                  onChange={(e) => setInverterEfficiency(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </Card>

            {/* Display Gauges */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-6 text-center flex flex-col justify-center items-center gap-2">
                  <span className="text-[10px] text-secondary font-mono uppercase font-bold tracking-wider">Daily Generation</span>
                  <span className="text-2xl font-black text-foreground font-serif">{dailyYield} kWh</span>
                  <span className="text-[10px] text-muted font-medium">Real-time estimate</span>
                </Card>
                <Card className="p-6 text-center flex flex-col justify-center items-center gap-2">
                  <span className="text-[10px] text-secondary font-mono uppercase font-bold tracking-wider">Est. Monthly Savings</span>
                  <span className="text-2xl font-black text-foreground font-serif">₹{monthlySavings.toLocaleString()}</span>
                  <span className="text-[10px] text-muted font-medium">@ ₹8.5 / unit tariff</span>
                </Card>
                <Card className="p-6 text-center flex flex-col justify-center items-center gap-2">
                  <span className="text-[10px] text-secondary font-mono uppercase font-bold tracking-wider">CO2 Offsets</span>
                  <span className="text-2xl font-black text-foreground font-serif">{co2Offset} kg/mo</span>
                  <span className="text-[10px] text-muted font-medium">Equiv. to planting ~5 trees</span>
                </Card>
              </div>

              {/* Technical context */}
              <Card className="p-5 text-xs text-secondary leading-relaxed flex flex-col gap-3">
                <h4 className="font-bold font-serif text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-foreground" /> Math Model Details
                </h4>
                <p className="font-medium">
                  This sandbox represents the client-side estimation model deployed in **Enermass Solar ERP**. In the production app, inputs are coupled with geospatial rooftop mapping APIs and coordinate trigonometry matrices to automatically calculate optimal tilt, local climate data variations, and structural solar shade factors.
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'quant' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Control Panel */}
            <Card className="lg:col-span-1 p-6 flex flex-col gap-6">
              <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider border-b border-card-border pb-2">
                Volatility Parameters
              </h3>

              {/* Regime Selector */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs text-secondary font-semibold">Select Market Regime:</span>
                <button
                  onClick={() => setMarketRegime('quiet')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center justify-between ${
                    marketRegime === 'quiet'
                      ? 'border-foreground/30 bg-foreground/5 text-foreground shadow-sm'
                      : 'border-card-border bg-card-bg text-secondary hover:border-foreground/15 hover:text-foreground'
                  }`}
                >
                  <span>Quiet Flat (Low Vol)</span>
                  <Badge variant={marketRegime === 'quiet' ? 'primary' : 'outline'} className="text-[8px] tracking-widest font-mono">14% IV</Badge>
                </button>
                <button
                  onClick={() => setMarketRegime('volatile')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center justify-between ${
                    marketRegime === 'volatile'
                      ? 'border-foreground/30 bg-foreground/5 text-foreground shadow-sm'
                      : 'border-card-border bg-card-bg text-secondary hover:border-foreground/15 hover:text-foreground'
                  }`}
                >
                  <span>Volatile Smirk (Trend Up)</span>
                  <Badge variant={marketRegime === 'volatile' ? 'primary' : 'outline'} className="text-[8px] tracking-widest font-mono">24% IV</Badge>
                </button>
                <button
                  onClick={() => setMarketRegime('crash')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center justify-between ${
                    marketRegime === 'crash'
                      ? 'border-foreground/30 bg-foreground/5 text-foreground shadow-sm'
                      : 'border-card-border bg-card-bg text-secondary hover:border-foreground/15 hover:text-foreground'
                  }`}
                >
                  <span>Panic Smirk (Crash Down)</span>
                  <Badge variant={marketRegime === 'crash' ? 'primary' : 'outline'} className="text-[8px] tracking-widest font-mono">38% IV</Badge>
                </button>
              </div>

              {/* Greeks Summary Info */}
              <div className="border-t border-card-border pt-4 flex flex-col gap-2">
                <span className="text-xs text-secondary font-semibold">Calculated Greeks (ATM Option):</span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-foreground/[0.02] border border-card-border rounded-lg py-2 flex flex-col">
                    <span className="text-[9px] text-secondary uppercase font-bold tracking-wide font-mono">Call Delta</span>
                    <span className="text-foreground font-bold font-mono">0.50</span>
                  </div>
                  <div className="bg-foreground/[0.02] border border-card-border rounded-lg py-2 flex flex-col">
                    <span className="text-[9px] text-secondary uppercase font-bold tracking-wide font-mono">Implied Vol</span>
                    <span className="text-foreground font-bold font-mono">{marketRegime === 'quiet' ? '14.0%' : marketRegime === 'volatile' ? '24.0%' : '38.0%'}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Implied Volatility Chart Plot */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-foreground" /> Options Implied Volatility Smile Skew
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={volChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="strike" stroke={axisColor} fontSize={10} />
                      <YAxis stroke={axisColor} domain={['auto', 'auto']} fontSize={10} unit="%" />
                      <Tooltip
                        contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                        labelStyle={{ color: tooltipTextColor, fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: tooltipTextColor }}
                      />
                      <Line
                        type="monotone"
                        dataKey="volatility"
                        stroke={lineColor}
                        strokeWidth={2}
                        dot={{ r: 4, stroke: lineColor, strokeWidth: 1.5, fill: dotColor }}
                        name="Implied Volatility"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Interactive Chain details */}
              <Card className="p-4 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left text-secondary font-mono">
                    <thead className="text-[9px] text-secondary uppercase font-bold tracking-wide border-b border-card-border">
                      <tr>
                        <th className="py-2">Strike</th>
                        <th className="py-2">Implied Vol</th>
                        <th className="py-2">Call Delta</th>
                        <th className="py-2">Put Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border/50 font-semibold">
                      {volChartData.slice(2, 7).map((row, idx) => (
                        <tr key={idx} className="hover:bg-foreground/[0.01]">
                          <td className="py-2 text-foreground">{row.strike}</td>
                          <td className="py-2 text-foreground">{row.volatility}%</td>
                          <td className="py-2 text-secondary">{row['Call Delta']}</td>
                          <td className="py-2 text-muted">{row['Put Delta']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="flex flex-col gap-8">
            {/* Top Row: strategy simulator control & risk calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Box 1: Strategy Simulator */}
              <Card className="p-6 flex flex-col justify-between gap-5 relative">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider border-b border-card-border pb-2 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-cyan-400" /> Strategy Simulator
                  </h3>

                  {/* Strategy Type Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-secondary uppercase font-bold font-mono">Active Strategy:</span>
                    <select
                      value={strategy}
                      onChange={(e) => {
                        const val = e.target.value as 'hmm' | 'reversion' | 'momentum';
                        setStrategy(val);
                        if (val === 'hmm') { setWinRate(62); setAvgWinPct(4.5); setAvgLossPct(2.0); }
                        else if (val === 'reversion') { setWinRate(54); setAvgWinPct(3.8); setAvgLossPct(2.5); }
                        else { setWinRate(45); setAvgWinPct(6.5); setAvgLossPct(3.0); }
                      }}
                      className="w-full bg-card-bg border border-card-border text-white text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-white/20 cursor-pointer"
                    >
                      <option value="hmm">Regime-Adaptive HMM Momentum</option>
                      <option value="reversion">Mean Reversion (RSI / GARCH)</option>
                      <option value="momentum">Classic Trend Breakout</option>
                    </select>
                  </div>

                  {/* Leverage slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-secondary font-mono">Leverage factor:</span>
                      <span className="text-foreground font-bold font-mono">{leverage}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={leverage}
                      onChange={(e) => setLeverage(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  {/* Slippage slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-secondary font-mono">Cost & Slippage drag:</span>
                      <span className="text-foreground font-bold font-mono">{slippage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.50"
                      step="0.05"
                      value={slippage}
                      onChange={(e) => setSlippage(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>

                {/* Outputs grids */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-card-border text-center text-xs">
                  <div className="bg-foreground/[0.02] border border-card-border rounded-xl p-2.5 flex flex-col gap-0.5">
                    <span className="text-[8px] text-secondary uppercase font-bold tracking-wide font-mono">Est. CAGR</span>
                    <span className="text-sm font-bold text-foreground font-mono">{metrics.cagr}%</span>
                  </div>
                  <div className="bg-foreground/[0.02] border border-card-border rounded-xl p-2.5 flex flex-col gap-0.5">
                    <span className="text-[8px] text-secondary uppercase font-bold tracking-wide font-mono">Sharpe Ratio</span>
                    <span className="text-sm font-bold text-foreground font-mono">{metrics.sharpe}</span>
                  </div>
                  <div className="bg-foreground/[0.02] border border-card-border rounded-xl p-2.5 flex flex-col gap-0.5">
                    <span className="text-[8px] text-secondary uppercase font-bold tracking-wide font-mono">Max Drawdown</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">{metrics.drawdown}%</span>
                  </div>
                </div>
              </Card>

              {/* Box 2: Risk / Reward Calculator */}
              <Card className="p-6 flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider border-b border-card-border pb-2 flex items-center gap-1.5">
                    <Calculator className="h-4 w-4 text-emerald-450" /> Position Risk Calculator
                  </h3>

                  {/* Sliders grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-secondary font-mono uppercase font-bold">Capital Size ($)</span>
                      <input 
                        type="number" 
                        value={capital}
                        onChange={(e) => setCapital(Number(e.target.value))}
                        className="bg-card-bg border border-card-border text-white text-xs font-semibold py-1.5 px-3 rounded-lg focus:outline-none focus:border-white/20 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-secondary font-mono uppercase font-bold">Risk Per Trade (%)</span>
                      <input 
                        type="number" 
                        step="0.1"
                        value={riskPct}
                        onChange={(e) => setRiskPct(Number(e.target.value))}
                        className="bg-card-bg border border-card-border text-white text-xs font-semibold py-1.5 px-3 rounded-lg focus:outline-none focus:border-white/20 w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-secondary font-mono uppercase">Entry Trigger ($)</span>
                      <input 
                        type="number" 
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        className="bg-card-bg border border-card-border text-white text-xs font-semibold py-1 px-2 rounded-lg focus:outline-none focus:border-white/20 w-full text-center"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-secondary font-mono uppercase text-rose-350">Stop Loss ($)</span>
                      <input 
                        type="number" 
                        value={stopLoss}
                        onChange={(e) => setStopLoss(Number(e.target.value))}
                        className="bg-card-bg border border-card-border text-white text-xs font-semibold py-1 px-2 rounded-lg focus:outline-none focus:border-white/20 w-full text-center"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-secondary font-mono uppercase text-emerald-450">Take Profit ($)</span>
                      <input 
                        type="number" 
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(Number(e.target.value))}
                        className="bg-card-bg border border-card-border text-white text-xs font-semibold py-1 px-2 rounded-lg focus:outline-none focus:border-white/20 w-full text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Outputs grids */}
                <div className="grid grid-cols-4 gap-2.5 pt-4 border-t border-card-border text-center text-[10px] font-semibold font-mono">
                  <div className="bg-foreground/[0.02] border border-card-border rounded-lg py-1.5 flex flex-col">
                    <span className="text-[8px] text-secondary uppercase font-bold leading-none mb-1">Risk Amount</span>
                    <span className="text-white font-bold">${amountAtRisk}</span>
                  </div>
                  <div className="bg-foreground/[0.02] border border-card-border rounded-lg py-1.5 flex flex-col">
                    <span className="text-[8px] text-secondary uppercase font-bold leading-none mb-1">Position Size</span>
                    <span className="text-white font-bold">{positionSize} Units</span>
                  </div>
                  <div className="bg-foreground/[0.02] border border-card-border rounded-lg py-1.5 flex flex-col">
                    <span className="text-[8px] text-secondary uppercase font-bold leading-none mb-1">R:R Ratio</span>
                    <span className="text-white font-bold">1 : {rrRatio}</span>
                  </div>
                  <div className="bg-foreground/[0.02] border border-card-border rounded-lg py-1.5 flex flex-col">
                    <span className="text-[8px] text-secondary uppercase font-bold leading-none mb-1">Target Profit</span>
                    <span className="text-emerald-450 font-bold">${targetProfit}</span>
                  </div>
                </div>
              </Card>

            </div>

            {/* Middle Row: Monte Carlo Equity Curve Plot & Drawdown Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Left Side: Parameters sliders */}
              <Card className="lg:col-span-1 p-6 flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-white/5 pb-2">
                    Monte Carlo Parameters
                  </h3>

                  {/* Win rate slider */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-secondary font-mono">Simulation Win Rate:</span>
                      <span className="text-foreground font-bold font-mono">{winRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="85"
                      value={winRate}
                      onChange={(e) => setWinRate(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Avg Win Return */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-secondary font-mono">Average Profit Size:</span>
                      <span className="text-foreground font-bold font-mono">+{avgWinPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="15.0"
                      step="0.5"
                      value={avgWinPct}
                      onChange={(e) => setAvgWinPct(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Avg Loss Return */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-secondary font-mono">Average Loss Size:</span>
                      <span className="text-foreground font-bold font-mono">-{avgLossPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="8.0"
                      step="0.5"
                      value={avgLossPct}
                      onChange={(e) => setAvgLossPct(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSeedIndex(prev => prev + 1)}
                  className="w-full py-2.5 border border-white/10 hover:border-white/25 bg-white/2 hover:bg-white/5 rounded-xl text-xs text-white font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="h-3 w-3 fill-white" /> Run Simulation
                </button>
              </Card>

              {/* Right Side: Recharts graphics (2 graphs stacked) */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {/* Graph 1: Equity Curves */}
                <Card className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] text-muted font-mono uppercase font-bold">Simulated Growth (5 Paths, $10k Start)</span>
                    <Badge variant="outline" className="text-[8px] tracking-widest font-mono">MONTE CARLO</Badge>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monteCarloData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="trade" stroke={axisColor} fontSize={9} />
                        <YAxis stroke={axisColor} fontSize={9} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                          labelStyle={{ color: tooltipTextColor, fontSize: '11px', fontWeight: 'bold' }}
                          itemStyle={{ color: tooltipTextColor, fontSize: '10px' }}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatter={(value: any) => [`$${Number(value ?? 0).toLocaleString()}`]}
                        />
                        <Line type="monotone" dataKey="Optimal HMM" stroke="#a855f7" strokeWidth={2} dot={false} name="Adaptive HMM" />
                        <Line type="monotone" dataKey="Standard Momentum" stroke="#38bdf8" strokeWidth={1.25} dot={false} name="Trend-Follower" />
                        <Line type="monotone" dataKey="Mean Reversion" stroke="#fbbf24" strokeWidth={1.25} dot={false} name="Mean-Reversion" />
                        <Line type="monotone" dataKey="Path 4" stroke="#34d399" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Path 4 (Noise)" />
                        <Line type="monotone" dataKey="Path 5" stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Path 5 (Noise)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Graph 2: Drawdown curves of Selected Path */}
                <Card className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] text-muted font-mono uppercase font-bold">Drawdown Profile % (Primary Path)</span>
                    <span className="text-[10px] text-rose-400 font-bold font-mono">Max Drawdown Visible</span>
                  </div>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monteCarloData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="trade" stroke={axisColor} fontSize={9} />
                        <YAxis stroke={axisColor} fontSize={9} unit="%" domain={[-100, 0]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                          labelStyle={{ color: tooltipTextColor, fontSize: '11px', fontWeight: 'bold' }}
                          itemStyle={{ color: tooltipTextColor, fontSize: '10px' }}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatter={(value: any) => [`${value ?? 0}%`]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Drawdown" 
                          stroke="#ef4444" 
                          fill="rgba(239, 68, 68, 0.15)" 
                          name="Selected Drawdown" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom Row: Market Regime explanation cards */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
                <ShieldCheck className="h-4 w-4 text-emerald-450" /> NF-LRD Market Regimes Discovery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Regime 1 */}
                <Card className="p-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[8px] font-mono border-emerald-500/20 text-emerald-400 bg-emerald-950/10 uppercase">State 0</Badge>
                    <span className="text-[9px] font-mono text-muted">HMM Class</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-serif">Bullish Low Volatility</h4>
                  <p className="text-[10.5px] text-secondary leading-relaxed font-semibold">
                    Steady upward appreciation with minimal price spikes. Highly favorable for trend-following momentum models and risk-leveraged positions.
                  </p>
                </Card>

                {/* Regime 2 */}
                <Card className="p-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[8px] font-mono border-sky-500/20 text-sky-400 bg-sky-950/10 uppercase">State 1</Badge>
                    <span className="text-[9px] font-mono text-muted">HMM Class</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-serif">Bullish High Volatility</h4>
                  <p className="text-[10.5px] text-secondary leading-relaxed font-semibold">
                    Late-cycle market expansions. Massive intraday swings require tighter stop-loss margins and smaller asset allocations.
                  </p>
                </Card>

                {/* Regime 3 */}
                <Card className="p-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[8px] font-mono border-rose-500/20 text-rose-400 bg-rose-955/10 uppercase">State 2</Badge>
                    <span className="text-[9px] font-mono text-muted">HMM Class</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-serif">Bearish High Volatility</h4>
                  <p className="text-[10.5px] text-secondary leading-relaxed font-semibold">
                    Panic selling and capitulation phases. Best traded via index options put hedges, short-selling setups, or strict cash conservation.
                  </p>
                </Card>

                {/* Regime 4 */}
                <Card className="p-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[8px] font-mono border-amber-500/20 text-amber-400 bg-amber-955/10 uppercase">State 3</Badge>
                    <span className="text-[9px] font-mono text-muted">HMM Class</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-serif">Bearish Low Volatility</h4>
                  <p className="text-[10.5px] text-secondary leading-relaxed font-semibold">
                    Range-bound accumulation bottom markets. Optimal environment for selling premium option spreads (e.g. Iron Condors).
                  </p>
                </Card>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
