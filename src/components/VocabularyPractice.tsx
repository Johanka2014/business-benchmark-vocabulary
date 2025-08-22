import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ChevronDown, Play, BookOpen, Award, TrendingUp } from 'lucide-react';
import businessHero from '@/assets/business-hero-bg.jpg';

const VocabularyPractice = () => {
  const [selectedUnit, setSelectedUnit] = useState('unit-1');

  const units = [
    { id: 'unit-1', name: 'Unit 1: Corporate Structure', lessons: 12 },
    { id: 'unit-2', name: 'Unit 2: Marketing Fundamentals', lessons: 15 },
    { id: 'unit-3', name: 'Unit 3: Financial Reporting', lessons: 10 },
    { id: 'unit-4', name: 'Unit 4: International Trade', lessons: 18 },
    { id: 'unit-5', name: 'Unit 5: Business Ethics', lessons: 8 }
  ];

  const stats = [
    { icon: BookOpen, label: 'Total Units', value: '5', color: 'text-primary' },
    { icon: Award, label: 'Completion Rate', value: '87%', color: 'text-accent' },
    { icon: TrendingUp, label: 'Progress', value: '3/5', color: 'text-secondary' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${businessHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 title-gradient leading-tight">
            Business Benchmark
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-foreground/90">
            Upper Intermediate
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Vocabulary Practice
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="glass-card p-4 min-w-[140px] hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Practice Card */}
        <Card className="glass-card w-full max-w-2xl p-8 md:p-12 animate-scale-in">
          <div className="space-y-8">
            {/* Unit Selection */}
            <div className="space-y-3">
              <label className="text-lg font-medium text-foreground/90 block">
                Select Learning Unit
              </label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="select-premium h-16 text-lg font-medium">
                  <SelectValue />
                  <ChevronDown className="w-5 h-5 opacity-50" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  {units.map((unit) => (
                    <SelectItem 
                      key={unit.id} 
                      value={unit.id}
                      className="text-lg py-4 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{unit.name}</span>
                        <span className="text-sm text-muted-foreground ml-4">
                          {unit.lessons} lessons
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <Button 
              className="premium-button w-full h-16 text-xl font-semibold group"
              onClick={() => console.log('Starting practice for:', selectedUnit)}
            >
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Practice Session
            </Button>

            {/* Additional Info */}
            <div className="text-center text-muted-foreground">
              <p className="text-sm">
                Practice sessions are adaptive and tailored to your learning pace
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-muted-foreground text-sm">
            Powered by advanced learning algorithms • Progress tracked in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPractice;