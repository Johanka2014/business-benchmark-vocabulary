import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ChevronDown, Play, BookOpen, Award, TrendingUp, ArrowLeft, ArrowRight, RotateCcw, Shuffle, Brain, Trophy } from 'lucide-react';
import businessHero from '@/assets/business-hero-bg.jpg';

interface VocabularyCard {
  word: string;
  definition: string;
}

interface Unit {
  id: string;
  name: string;
  cards: VocabularyCard[];
}

type ViewType = 'selection' | 'flashcards' | 'quiz' | 'results';

const VocabularyPractice = () => {
  const [currentView, setCurrentView] = useState<ViewType>('selection');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [units, setUnits] = useState<Unit[]>([]);
  const [currentDeck, setCurrentDeck] = useState<VocabularyCard[]>([]);
  
  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<VocabularyCard[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  // Parse CSV data
  useEffect(() => {
    const csvData = `Unit,Word,Comment,Definition,Pronunciation,Page
Unit 1,bonus,noun,"an amount of money given to an employee in addition to their salary as a reward for working well",ˈbəʊ.nəs,8.0
Unit 1,committed,adjective,"loyal and willing to give your time and energy to something that you believe in",kəˈmɪt.ɪd,11.0
Unit 1,computer literate,adjective phrase,"able to use computers effectively",kəmˈpjuː.tə ˈlɪt.ər.ət,10.0
Unit 1,consistent,adjective,"always behaving or happening in a similar, especially positive, way",kənˈsɪs.tənt,8.0
Unit 1,core skill,noun phrase,"a particular ability that you develop through training and experience and that is necessary to do a particular job",kɔː skɪl,10.0
Unit 1,corporate culture,noun phrase,"the beliefs and ideas that a company has and the way in which they affect how it does business and how its employees behave",ˈkɔː.pər.ət ˈkʌl.tʃə,10.0
Unit 1,dedicated,adjective,"used only for one particular purpose or job",ˈded.ɪ.keɪ.tɪd,8.0
Unit 1,diverse,adjective,"varied or different",daɪˈvɜːs,8.0
Unit 1,do overtime,verb phrase,"to work after the usual time needed or expected in a job",duː ˈəʊ.və.taɪm,11.0
Unit 1,earn an award,verb phrase,"to be given money or a prize following an official decision",ɜːn ˈən əˈwɔːd,11.0
Unit 1,goal setting,noun phrase,"the process of deciding what you want to achieve or what you want someone else to achieve over a particular period",ɡəʊl set.ɪŋ,10.0
Unit 1,hands-on training,noun phrase,"a way of learning in which you do things instead of just reading or learning about them",ˈhænd .zɒn treɪn.ɪŋ,10.0
Unit 1,headhunter,noun,"a person who is hired by a company to find someone who has the qualifications for an important job and is willing to leave their present job",ˈhedˌhʌn.tə,11.0
Unit 1,in-house,adjective,"being done by employees within an organization rather than by other companies or independent workers",ˌɪnˈhaʊs,8.0
Unit 1,intensive,adjective,"involving a lot of effort or activity in a short period of time",ɪnˈtent.sɪv,8.0
Unit 1,learning goal,noun phrase,"an aim or purpose that you intend to achieve by study",lɜːn.ɪŋ ɡəʊl,10.0
Unit 1,material incentive,noun phrase,"something, especially money, that encourages a person or organization to do something",məˈtɪə.ri.əl ɪnˈsen.tɪv,11.0
Unit 1,personal development,noun phrase,"the process of improving your skills and increasing the amount of experience that you have in your job",ˈpɜː.sən.əl dɪˈvel.əp.mənt,11.0
Unit 1,procedure,noun,"a set of actions which is the usual or official way of doing something",prəʊˈsiː.dʒə,8.0
Unit 1,professionalism,noun,"the combination of all the qualities that are connected with trained and skilled people",prəˈfeʃ.ən.əl.ɪ.zəm,11.0
Unit 1,promote from within,verb phrase,"to raise someone who already belongs to an organization to a higher or more important position or rank within that organization",prəˈməʊt frɒm wɪˈðɪn,11.0
Unit 1,quotation,noun,"a statement of how much a job, service, or product will cost",kwəʊˈteɪ.ʃən,8.0
Unit 1,recognition,noun,"the act of praising or rewarding someone for something they have done",ˌrek.əɡˈnɪʃ.ən,8.0
Unit 1,safety regulation,noun phrase,"an official rule that is meant to keep people protected from danger or harm",ˈseɪf.ti ˌreɡ.jəˈleɪ.ʃən,11.0
Unit 1,supervisor,noun,"a person who is in charge of a group of people or an area of work and who makes sure that the work is done correctly and according to the rules",ˈsuː.pə.vaɪ.zə,8.0
Unit 1,tailor-made,adjective,"specially made for a particular person, organization, or purpose",ˌteɪ.ləˈmeɪd,8.0
Unit 1,take on,phrasal verb,"to employ someone",teɪk ɒn,11.0
Unit 1,time management,noun phrase,"the practice of using your time effectively, and the study of this",taɪm ˈmæn.ɪdʒ.mənt,11.0
Unit 1,training budget,noun phrase,"the amount of money you have available to spend on teaching the skills that you will need to do a particular job or activity",treɪn.ɪŋ ˈbʌdʒ.ɪt,11.0
Unit 2,downsize,verb,"to reduce the number of people who work in a company, business, etc. in order to reduce costs",ˈdaʊn.saɪz,12.0
Unit 2,decentralise,verb,"to give some of the power of a central government, organisation, etc. to smaller parts or organisations around the country",ˌdiːˈsen.trəl.aɪz,12.0
Unit 2,deregulate,verb,"to remove national or local government controls or rules from a business or other activity",ˌdiːˈreɡ.jə.leɪt,12.0
Unit 2,headquarters,noun,"the main office or centre of control of a company, organisation, etc.",ˌhedˈkwɔː.təz,12.0
Unit 2,outsource,verb,"to arrange for somebody outside a company to do work or provide goods for that company",ˈaʊt.sɔːs,14.0
Unit 2,streamline,verb,"to make a system, an organisation, etc. work better, especially in a way that saves money",ˈstriːm.laɪn,12.0
Unit 3,customs,noun,"the place at a port, airport or border where officials check goods or people coming into a country",ˈkʌs.təmz,18.0
Unit 3,warehouse,noun,"a building where large quantities of goods are stored, especially before they are sent to shops/stores to be sold",ˈweə.haʊs,18.0
Unit 3,logistics,noun,"the practical organisation of something",ləˈdʒɪs.tɪks,18.0
Unit 3,procurement,noun,"the process of obtaining supplies of something, especially for a government or an organisation",prəˈkjʊə.mənt,18.0
Unit 4,brief,noun,"a set of instructions or information",briːf,20.0
Unit 4,deadline,noun,"a point in time by which something must be done",ˈded.laɪn,20.0
Unit 4,involve,verb,"to include or affect someone or something",ɪnˈvɒlv,20.0
Unit 4,milestone,noun,"a very important stage or event in the development of something",ˈmaɪl.stəʊn,20.0`;

    parseCSV(csvData);
  }, []);

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const unitIndex = headers.indexOf('Unit');
    const wordIndex = headers.indexOf('Word');
    const definitionIndex = headers.indexOf('Definition');
    
    if (unitIndex === -1 || wordIndex === -1 || definitionIndex === -1) return;

    const cardsByUnit: { [key: string]: VocabularyCard[] } = {};

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      const values = lines[i].match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g) || [];
      if (values.length > Math.max(wordIndex, definitionIndex, unitIndex)) {
        const unit = values[unitIndex].trim();
        const word = (values[wordIndex] || '').replace(/"/g, '').trim();
        const definition = (values[definitionIndex] || '').replace(/"/g, '').trim();
        
        if (unit && word && definition) {
          if (!cardsByUnit[unit]) {
            cardsByUnit[unit] = [];
          }
          cardsByUnit[unit].push({ word, definition });
        }
      }
    }

    const parsedUnits = Object.keys(cardsByUnit)
      .sort((a, b) => {
        const numA = parseInt(a.replace('Unit ', ''));
        const numB = parseInt(b.replace('Unit ', ''));
        return numA - numB;
      })
      .map(unitKey => ({
        id: unitKey.toLowerCase().replace(' ', '-'),
        name: unitKey,
        cards: cardsByUnit[unitKey]
      }));

    setUnits(parsedUnits);
    if (parsedUnits.length > 0) {
      setSelectedUnit(parsedUnits[0].id);
    }
  };

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startFlashcards = () => {
    const unit = units.find(u => u.id === selectedUnit);
    if (unit) {
      setCurrentDeck(unit.cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCurrentView('flashcards');
    }
  };

  const startQuiz = () => {
    const unit = units.find(u => u.id === selectedUnit);
    if (unit && unit.cards.length >= 4) {
      const questions = shuffleArray(unit.cards);
      setQuizQuestions(questions);
      setCurrentQuizIndex(0);
      setQuizScore(0);
      setShowFeedback(false);
      setSelectedAnswer('');
      generateQuizOptions(questions[0], unit.cards);
      setCurrentView('quiz');
    }
  };

  const generateQuizOptions = (question: VocabularyCard, allCards: VocabularyCard[]) => {
    const correctAnswer = question.word;
    const incorrectAnswers = allCards
      .filter(card => card.word !== correctAnswer)
      .map(card => card.word);
    
    const shuffledIncorrect = shuffleArray(incorrectAnswers);
    const options = shuffleArray([correctAnswer, ...shuffledIncorrect.slice(0, 3)]);
    setQuizOptions(options);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === quizQuestions[currentQuizIndex].word) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      const nextIndex = currentQuizIndex + 1;
      setCurrentQuizIndex(nextIndex);
      setSelectedAnswer('');
      setShowFeedback(false);
      const unit = units.find(u => u.id === selectedUnit);
      if (unit) {
        generateQuizOptions(quizQuestions[nextIndex], unit.cards);
      }
    } else {
      setCurrentView('results');
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Total Units', value: units.length.toString(), color: 'text-primary' },
    { icon: Award, label: 'Cards Available', value: currentDeck.length.toString(), color: 'text-accent' },
    { icon: TrendingUp, label: 'Current Unit', value: selectedUnit ? selectedUnit.replace('-', ' ') : '0', color: 'text-secondary' }
  ];

  // Unit Selection View
  if (currentView === 'selection') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${businessHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
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

          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
            {stats.map((stat) => (
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

          <Card className="glass-card w-full max-w-2xl p-8 md:p-12 animate-scale-in">
            <div className="space-y-8">
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
                            {unit.cards.length} words
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="premium-button w-full h-16 text-xl font-semibold group"
                onClick={startFlashcards}
                disabled={!selectedUnit}
              >
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Start Practice Session
              </Button>

              <div className="text-center text-muted-foreground">
                <p className="text-sm">
                  Practice sessions are adaptive and tailored to your learning pace
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Flashcards View
  if (currentView === 'flashcards') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${businessHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="outline" 
                className="glass-card border-white/20 text-foreground hover:bg-white/20"
                onClick={() => setCurrentView('selection')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Units
              </Button>
              <h1 className="text-3xl font-bold text-center title-gradient">
                Study Flashcards - {units.find(u => u.id === selectedUnit)?.name}
              </h1>
              <div className="w-24" /> {/* Spacer */}
            </div>

            {/* Flashcard */}
            <div className="perspective-1000 mb-8">
              <div 
                className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front of card */}
                <Card className="absolute inset-0 glass-card p-12 flex flex-col justify-center items-center backface-hidden">
                  <p className="text-sm text-muted-foreground mb-4">Word</p>
                  <h2 className="text-4xl font-bold text-center text-foreground">
                    {currentDeck[currentCardIndex]?.word}
                  </h2>
                </Card>
                
                {/* Back of card */}
                <Card className="absolute inset-0 glass-card p-12 flex flex-col justify-center items-center backface-hidden rotate-y-180 bg-primary/20">
                  <p className="text-sm text-primary-foreground/70 mb-4">Definition</p>
                  <p className="text-xl text-center text-primary-foreground leading-relaxed">
                    {currentDeck[currentCardIndex]?.definition}
                  </p>
                </Card>
              </div>
            </div>

            {/* Progress */}
            <div className="text-center mb-6">
              <p className="text-muted-foreground font-medium">
                Card {currentCardIndex + 1} of {currentDeck.length}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-3">
                <Button 
                  variant="outline"
                  className="glass-card border-white/20 text-foreground hover:bg-white/20"
                  onClick={() => {
                    setCurrentDeck(shuffleArray(currentDeck));
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle Deck
                </Button>
                
                <Button 
                  className="premium-button px-10"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Flip Card
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline"
                  className="glass-card border-white/20 text-foreground hover:bg-white/20"
                  onClick={() => {
                    setCurrentCardIndex(prev => prev > 0 ? prev - 1 : currentDeck.length - 1);
                    setIsFlipped(false);
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button 
                  className="premium-button bg-accent hover:bg-accent/90"
                  onClick={startQuiz}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Take the Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button 
                  variant="outline"
                  className="glass-card border-white/20 text-foreground hover:bg-white/20"
                  onClick={() => {
                    setCurrentCardIndex(prev => prev < currentDeck.length - 1 ? prev + 1 : 0);
                    setIsFlipped(false);
                  }}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  if (currentView === 'quiz') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${businessHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-3xl">
            <Card className="glass-card p-8">
              <div className="flex justify-between items-center mb-6">
                <Button 
                  variant="outline" 
                  className="glass-card border-white/20 text-foreground hover:bg-white/20"
                  onClick={() => setCurrentView('flashcards')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Study
                </Button>
                <div className="text-center">
                  <h1 className="text-2xl font-bold title-gradient">
                    Vocabulary Quiz - {units.find(u => u.id === selectedUnit)?.name}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Question {currentQuizIndex + 1} of {quizQuestions.length}
                  </p>
                </div>
                <div className="w-20" />
              </div>

              <Card className="glass-card p-6 mb-6 bg-white/5">
                <p className="text-sm text-muted-foreground mb-2">Definition:</p>
                <p className="text-lg text-foreground">
                  {quizQuestions[currentQuizIndex]?.definition}
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {quizOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`
                      p-4 h-auto text-left justify-start transition-all duration-300 border-2
                      ${selectedAnswer === option 
                        ? option === quizQuestions[currentQuizIndex]?.word 
                          ? 'bg-green-500 border-green-400 text-white' 
                          : 'bg-red-500 border-red-400 text-white'
                        : showFeedback && option === quizQuestions[currentQuizIndex]?.word
                          ? 'bg-green-500 border-green-400 text-white'
                          : 'glass-card border-white/20 text-foreground hover:bg-white/20'
                      }
                    `}
                    onClick={() => !showFeedback && handleAnswerSelect(option)}
                    disabled={showFeedback}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <div className="h-6 mb-4">
                  {showFeedback && (
                    <p className={`text-lg font-semibold ${
                      selectedAnswer === quizQuestions[currentQuizIndex]?.word 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {selectedAnswer === quizQuestions[currentQuizIndex]?.word ? 'Correct!' : 'Incorrect!'}
                    </p>
                  )}
                </div>
                
                {showFeedback && (
                  <Button 
                    className="premium-button px-10"
                    onClick={nextQuestion}
                  >
                    {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (currentView === 'results') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${businessHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <Card className="glass-card p-8 text-center max-w-2xl">
            <Trophy className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="text-4xl font-bold title-gradient mb-6">Quiz Complete!</h1>
            <p className="text-lg text-muted-foreground mb-4">Your final score is:</p>
            <p className="text-6xl font-bold text-primary mb-8">
              {quizScore} / {quizQuestions.length}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline"
                className="glass-card border-white/20 text-foreground hover:bg-white/20"
                onClick={() => setCurrentView('flashcards')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Study More
              </Button>
              <Button 
                className="premium-button"
                onClick={startQuiz}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default VocabularyPractice;