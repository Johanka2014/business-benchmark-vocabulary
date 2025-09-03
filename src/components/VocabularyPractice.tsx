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
Unit 2,career coaching,noun phrase,"the process of teaching the skills needed to succeed in a particular job",kəˈrɪə kəʊ.tʃɪŋ,12.0
Unit 2,cashier,noun,"someone whose job is to take payments from customers or give out money in a store, bank, etc.",kəˈʃɪə,12.0
Unit 2,challenging,adjective,"difficult, in a way that tests your ability or determination",ˈtʃæl.ɪn.dʒɪŋ,12.0
Unit 2,discipline,noun,"the practice of making sure that people obey rules and do not cause problems",ˈdɪs.ə.plɪn,12.0
Unit 2,diversity,noun,"the fact of there being people of many different groups in society, within an organization, etc.",daɪˈvɜː.sə.ti,12.0
Unit 2,effective promotional campaign,noun phrase,"a well-planned and successful group of activities which are intended to advertise something",ɪˈfek.tɪv prəˈməʊ.ʃən.əl kæmˈpeɪn,12.0
Unit 2,efficient,adjective,"using resources such as time, materials, or energy well without wasting any",ɪˈfɪʃ.ənt,12.0
Unit 2,financial paperwork,noun phrase,"the part of a job which involves keeping records of how money is managed",faɪˈnæn.tʃəl ˈpeɪ.pə.wɜːk,12.0
Unit 2,fire,verb,"to make someone leave their job, especially because they have done something wrong",faɪə,12.0
Unit 2,fulfilling,adjective,"making you feel happy and satisfied",fʊlˈfɪl.ɪŋ,12.0
Unit 2,issue,verb,"to give someone something, especially officially",ˈɪʃ.uː,12.0
Unit 2,large-scale project,noun phrase,"a large piece of planned work or building activity which is finished over a long period of time",lɑːdʒ skeɪl prəʊˈdʒekt,12.0
Unit 2,performance,noun,"how well someone does their job or their duties",pəˈfɔː.mənts,12.0
Unit 2,personnel (department),noun,"the department of a company or organization that deals with employees when they join or leave, when they need training, when they have problems, etc.",ˌpɜː.sənˈel,12.0
Unit 2,personnel (employees),noun,"the people who are employed by a company or organization",ˌpɜː.sənˈel,12.0
Unit 2,pull the wool over someone's eyes,verb phrase,"to deceive someone in order to prevent them from discovering something",pʊl ðiː wʊl ˈəʊ.və ˈsʌm.wʌnz aɪz,12.0
Unit 2,role,noun,"the position or purpose that someone or something has in a situation, organization, society or relationship",rəʊl,12.0
Unit 2,selling point,noun,"a characteristic of a product or service that will persuade people to buy it",sel.ɪŋ pɔɪnt,12.0
Unit 2,thrive,verb,"to grow, develop, and become successful",θraɪv,12.0
Unit 2,warehouse,noun,"a large building for storing things before they are sold, used, or sent out to stores",ˈweə.haʊz,12.0
Unit 2,workwise,adverb,"relating to work",ˈwɜːk.waɪz,12.0
Unit 3,advertising campaign,noun phrase,"a planned series of advertisements that will be used in particular places at particular times in order to advertise a product or service and persuade people to buy it or use it",ˈæd.və.taɪ.zɪŋ kæmˈpeɪn,18.0
Unit 3,approval,noun,"official permission or agreement for something",əˈpruː.vəl,18.0
Unit 3,assign,verb,"to give a particular job or piece of work to someone",əˈsaɪn,18.0
Unit 3,be yourself,verb phrase,"to behave in your usual manner rather than behaving in a way you think other people might like",bɪ jɔːˈself,18.0
Unit 3,brand,noun,"the name of a product produced or sold by a particular company or what the characteristics appearance etc. a person organization product etc. is known for",brænd,18.0
Unit 3,colleague,noun,"a person that you work with",ˈkɒl.iːɡ,18.0
Unit 3,compile documents,verb phrase,"to collect information from papers with written or printed information especially of an official type and arrange it in a book report or list",kəmˈpaɪl ˈdɒk.jə.mənts,18.0
Unit 3,embarrassment,noun,"when you feel nervous worried or uncomfortable",ɪmˈbær.əs.mənt,18.0
Unit 3,emphasise,verb,"to show or state that something is very important or worth giving attention to",ˈemp.fə.saɪz,18.0
Unit 3,file,verb,"to store information or documents carefully so that they are easy to find either in a place such as a folder or desk or on a computer",faɪl,18.0
Unit 3,follow up,phrasal verb,"to do something to finish a previous action or make it more successful",ˈfɒl.əʊ ʌp,18.0
Unit 3,get a complete picture,verb phrase,"to understand someone or something better",ɡet eɪ kəmˈpliːt ˈpɪk.tʃə,18.0
Unit 3,go straight in the bin,verb phrase,"to immediately put something into a container for waste or refuse to consider something",ɡəʊ streɪt ɪn ðiː bɪn,18.0
Unit 3,image,noun,"the way that something or someone is thought of by other people",ˈɪm.ɪdʒ,18.0
Unit 3,initiate,verb,"to begin something",ɪˈnɪʃ.i.eɪt,18.0
Unit 3,innovate,verb,"to develop a new design product idea etc.",ˈɪn.əʊ.veɪt,18.0
Unit 3,inspire,verb,"to make someone feel that they want to do something and can do it",ɪnˈspaɪə,18.0
Unit 3,intellectually stimulating,adjective phrase,"encouraging you to think and understand new and complicated ideas",ˌɪn.təlˈek.tʃu.əli ˈstɪm.jəl.eɪ.tɪŋ,18.0
Unit 3,interact,verb,"to communicate with someone",ˌɪn.tərˈækt,18.0
Unit 3,internship,noun,"a period of time during which a student works for a company or organization in order to get experience of a particular type of work",ˈɪn.tɜːn.ʃɪp,18.0
Unit 3,intimidate,verb,"to frighten or threaten someone usually in order to persuade them to do something that you want them to do",ɪnˈtɪm.ɪ.deɪt,18.0
Unit 3,logo,noun,"a design or symbol displayed on a company's products vehicles signs etc. that expresses the company's character and purpose and makes it easy for customers to recognize and remember the company",ˈləʊ.ɡəʊ,18.0
Unit 3,mobile technology,noun phrase,"the use of scientific knowledge or processes relating to phones or computers used while travelling from place to place without being connected by wires",ˈməʊ.baɪl tekˈnɒl.ə.dʒi,18.0
Unit 3,packaging,noun,"the materials in which objects are wrapped before being sold",ˈpæk.ɪ.dʒɪŋ,18.0
Unit 3,prospective employer,noun phrase,"a person or organization that might employ you in the future",prəˈspek.tɪv ɪmˈplɔɪ.ə,18.0
Unit 3,referee,noun,"a person who knows you and who is willing to describe your character and abilities in order to support you when you are trying to get a job etc.",ˌref.ərˈiː,18.0
Unit 3,speak out freely,verb phrase,"to give your opinion about something without being controlled or limited especially on a subject which you have strong feelings about",spiːk aʊt friː.li,18.0
Unit 3,stay on one's toes,verb phrase,"to continue directing all your attention and energy to what you are doing",steɪ ɒn aʊə təʊz,18.0
Unit 3,wisdom,noun,"the ability to use your knowledge and experience to make good decisions and judgments",ˈwɪz.dəm,18.0
Unit 3,workplace,noun,"a building or room where people perform their jobs or these places generally",ˈwɜːk.pleɪs,18.0
Unit 4,brief,noun,"a set of instructions or information",briːf,20.0
Unit 4,deadline,noun,"a point in time by which something must be done",ˈded.laɪn,20.0
Unit 4,involve,verb,"to include or affect someone or something",ɪnˈvɒlv,20.0
Unit 4,milestone,noun,"a very important stage or event in the development of something",ˈmaɪl.stəʊn,20.0`
Unit 4,account for ,verb phrase, "to form the total of something",əˈkaʊnt fɔː
Unit 4,attitude ,noun,"a feeling or opinion about something, especially when this shows in your behaviour",ˈæt.ɪ.tʃuːd
Unit 4,body language,noun phrase,"body movements that show someone's thoughts and feelings",ˈbɒd.i ˈlæŋ.ɡwɪdʒ
Unit 4,carry out research,verb phrase,"to do or complete a detailed study of a subject, especially in order to discover (new) information ",ˈkær.i aʊt rɪˈsɜːtʃ
Unit 4,charge ,verb,"to ask for a particular amount of money for something, especially a service or activity",tʃɑːdʒ
Unit 4,check availability ,verb phrase,"to find out if something is able to be bought, used or reached",tʃek əˌveɪ.ləˈbɪl.ə.ti
Unit 4,critical,adjective,"extremely important to the progress or success of something",ˈkrɪt.ɪ.kəl
Unit 4,crucial ,adjective,"extremely important or necessary",ˈkruː.ʃəl
Unit 4,dress formally,verb phrase,"to wear a serious type of clothes",dres ˈfɔː.məli
Unit 4,drive ,verb,"to cause or influence something",draɪv
Unit 4,finalise ,verb,"to make a final and certain decision about a plan, date, etc",ˈfaɪ.nəl.aɪz
Unit 4,form an impression (of sthg/sb) ,verb phrase,"to get an idea or opinion of what something is like",fɔːm ˈæn ɪmˈpreʃ.ən
Unit 4,full-time ,adjective,"for all the hours of the week that people normally work, not just for some of them",ˌfʊlˈtaɪm
Unit 4,get sthg up on the screen ,verb phrase,"to make something able to be seen or read on a computer system" ,ˈɡet.ʌp ɒn ðiː skriːn
Unit 4,hold on,phrasal verb,"to wait while someone else does something, especially when you are using the phone",həʊld ɒn
Unit 4,incoming phone call,noun phrase, "when someone uses the phone to call you" ,ˈɪnˌkʌm.ɪŋ fəʊn kɔːl
Unit 4,instinctive ,adjective,"Instinctive behaviour or reactions are not thought about, planned or developed by training.",ɪnˈstɪŋk.tɪv
Unit 4,intended recipient,noun phrase,"the person who is meant to receive something" ,ɪnˈten.dɪd rɪˈsɪp.i.ənt
Unit 4,part-time ,adjective,"for only some of the hours of the week that people normally work, not all of them",ˌpɑːtˈtaɪm
Unit 4,progress report,noun phrase,"a description of an event or situation  that explains how much progress is being made" ,prəʊˈɡres rɪˈpɔːt
Unit 4,rate ,noun,"an amount of money that is charged or paid for a particular service",reɪt
Unit 4,reinforce,verb,"to make an idea or belief stronger",ˌriː.ɪnˈfɔːs
Unit 5,affordable pricing,noun phrase, "when a company offers goods that are not expensive",əˈfɔː.də.bəl ˈpraɪs.ɪŋ
Unit 5,app developer,noun phrase, "someone whose job is to create computer programs designed for particular purposes",æp dɪˈvel.ə.pə
Unit 5,appeal to,verb phrase,"to interest or attract someone",əˈpiːl tuː
Unit 5,brand ambassador,noun phrase,"a manager who is responsible for creating and developing a brand and encouraging support for it, both inside and outside a company",brænd æmˈbæs.ə.də
Unit 5,capitalise on,verb phrase,"to use a situation to your own advantage",ˈkæp.ɪ.təl.aɪz ɒn
Unit 5,competitor,noun,"a person, product, company, etc. that is trying to compete with others, for example, by trying to make bigger sales in a particular market",kəmˈpet.ɪ.tə
Unit 5,cross over,phrasal verb,"the process or result of changing from one activity or style to another",ˈkrɒs ˈəʊ.və
Unit 5,customer loyalty ,noun phrase,"the fact of a customer buying products or services from the same company over a long period of time",ˈkʌs.tə.mə ˈlɔɪ.əl.ti
Unit 5,emerging market,noun phrase,"a part of the world which is beginning to have economic power or success and where something might be sold" ,ɪˈmɜː.dʒɪŋ ˈmɑː.kɪt
Unit 5,overheads ,plural noun,"the regular and necessary costs, such as rent and heating, that are involved in operating a business",ˈəʊ.və.hedz
Unit 5,pay a premium ,verb phrase,"to give a larger amount of money  than usual for something" ,peɪ eɪ ˈpriː.mi.əm
Unit 5,premium price segment,noun phrase,""a part into which the economy or a company's business can be divided which involves charging or paying high prices for something" ,ˈpriː.mi.əm praɪs seɡˈment
Unit 5,price ladder,noun phrase,"a way of referring to a series of several different prices to choose from, depending on the quality of the product",praɪs ˈlæd.ə
Unit 5,print ad,noun phrase,"an advertisement that appears in a newspaper or magazine, rather than on television, radio, or the Internet",prɪnt æd
Unit 5,property consultant,noun phrase,"someone who is paid to give expert advice or training on buildings and land, considered as things to be bought and sold",ˈprɒp.ə.ti kənˈsʌl.tənt
Unit 5,publicity,noun,"the activity of making certain that someone or something attracts a lot of interest or attention from many people, or the attention received as a result of this activity",pʌbˈlɪs.ə.ti
Unit 5,supplier ,noun,"a company that provides a product, or the materials to make a product",səˈplaɪ.ə
Unit 5,target,verb,"to direct something, especially advertising or a product, at a particular group of people or a particular area",ˈtɑː.ɡɪt
Unit 5,viral video,noun phrase,"an electronic recording of moving images which very quickly spreads or becomes popular through communication from one person to another, especially on the Internet",ˈvaɪə.rəl ˈvɪd.i.əʊ
Unit 5,watchword,noun ,"(a word or phrase which represents) the main ideas or principles directing the way that someone behaves or the way that something is done",ˈwɒtʃ.wɜːd
Unit 6,a year in development,noun phrase,"the period of twelve months during which something such as a new product or service is created",eɪ jɪə ɪn dɪˈvel.əp.mənt
Unit 6,approach,verb,"to speak to, write to, or visit another person or group in order to do something such as make a request or business agreement",əˈprəʊtʃ
Unit 6,big player ,noun phrase,"someone who has a lot of influence in an activity or organization",bɪɡ pleɪ.ə
Unit 6,break down,phrasal verb,"If a system, relationship, or discussion breaks down, it fails because there is a problem or disagreement.",ˈbreɪk daʊn
Unit 6,budget allocation,noun phrase,"a plan that shows the amount of money that an organisation is allowed to spend on particular things",ˈbʌdʒ.ɪt ˌæl.əˈkeɪ.ʃən
Unit 6,generic,adjective,"shared by, typical of, or relating to a whole group of similar things, rather than to any particular thing",dʒəˈner.ɪk
Unit 6,market research,noun phrase,"the collection and study of information about what people prefer to buy, how they react to advertising, and what other businesses in the same industry are doing",ˈmɑː.kɪt rɪˈsɜːtʃ
Unit 6,marketing spend ,noun phrase,"the amount of money that is spent on encouraging people to buy a product or service",ˈmɑːkɪ.tɪŋ spend
Unit 6,pack,verb,"to put something into a container",pæk
Unit 6,pitch,verb,"to try to persuade someone to buy your products/services or choose you to do some work for them",pɪtʃ
Unit 6,raise awareness ,verb phrase,"to make people realise that something exists",reɪz əˈweə.nɪs
Unit 6,raise finance,verb phrase,"to manage to get money to invest in a business, project, property, etc",reɪz ˈfaɪ.nænts
Unit 6,range,noun,"a number of similar things considered as a group",reɪndʒ
Unit 6,retail customer,noun phrase,"a person who buys goods, rather than a store or other business",ˈriː.teɪl ˈkʌs.tə.mə
Unit 6,set up a production facility,verb phrase,"to arrange a new building or area where goods will be made",set ʌp eɪ prəˈdʌk.ʃən fəˈsɪl.ə.ti
Unit 6,strategy ,noun,"the way in which a business, government, or other organization carefully plans its actions over a period of time to improve its position and achieve what it wants",ˈstræt.ə.dʒi
Unit 6,supply chain,noun phrase,"the system of people and organizations that are involved in getting a product from the place where it is made to customers",ˈsʌ.pəl.i tʃeɪn
Unit 6,transform the business,verb phrase,"to change completely the character of a particular company in order to improve it",træntˈsfɔːm ðiː ˈbɪz.nɪs
Unit 6,turning point ,noun phrase,"a time when a situation starts to change in an important way",ˈtɜː.nɪŋ pɔɪnt
Unit 6,upmarket,adjective,"used to describe products and services that are of a high quality compared to others",ˌʌpˈmɑː.kɪt
Unit 7,commercial edge,noun phrase,"an advantage over the people or businesses who are competing with you",kəˈmɜː.ʃəl edʒ
Unit 7,control costs,noun phrase,"to limit the amount of money that has to be spent in order to buy, do, or make something",kənˈtrəʊl kɒsts
Unit 7,custom-built,adjective,If something is custom-built it is specially made for a particular buyer ,ˈkʌs.təm.bɪlt
Unit 7,customised solution,noun phrase,used to describe something that has been made to solve a customer's particular needs  ,ˈkʌs.tə.maɪzd səˈluː.ʃən
Unit 7,enhance,verb,"to improve the quality, amount, or value of something",ɪnˈhɑːnts
Unit 7,exhibit,verb,"to show something publicly in a place such as a museum or trade show",ɪɡˈzɪb.ɪt
Unit 7,fee ,noun,"an amount of money paid for a particular piece of work or for a particular right or service",fiː
Unit 7,for hire,adjec phrase,"something that can be used temporarily in exchange for money",fɔː haɪə
Unit 7,give you an edge over your competition,verb phrase,"to give you an advantage over the people or businesses who are competing with you in a particular market",ɡɪv juː ˈæn edʒ ˈəʊ.və jɔː ˌkɒm.pəˈtɪʃ.ən
Unit 7,guarantee ,verb,"to promise that something will happen or is true",ˌɡær.ənˈtiː
Unit 7,huge stock,noun phrase,"a large amount of goods that a store or business has for sale",hjuːdʒ stɒk
Unit 7,install,verb,"to put furniture, a machine, or a piece of equipment into position and make it ready to use",ɪnˈstɔːl
Unit 7,keen price,noun phrase,"If prices are keen, they are lower and offer more value than others.",kiːn praɪs
Unit 7,legal requirement ,noun phrase,"a rule in law about something that it is necessary to have or to do",ˈliː.ɡəl rɪˈkwaɪə.mənt
Unit 7,liaise,verb,"to work with someone in order to exchange information with them",liˈeɪz
Unit 7,make an impact,verb phrase,"to have a powerful effect on someone or something",meɪk ˈæn ɪmˈpækt
Unit 7,man the stand,verb phrase,"to work at a table or structure where someone can sell or advertise their products or services",mæn ðiː stænd
Unit 7,marketing advantage,noun phrase,"an advantage over the people or businesses who are competing with you",ˈmɑːkɪ.tɪŋ ədˈvɑːn.tɪdʒ
Unit 7,marketing solution,noun phrase,"a way of finding out what customers want, using that information to design products and services, and selling them effectively",ˈmɑːkɪ.tɪŋ səˈluː.ʃən
Unit 7,maximise visitor numbers,verb phrase,"to make the amount of people who visit as big as possible",ˈmæk.sɪ.maɪz ˈvɪz.ɪ.tə ˈnʌm.bəz
Unit 7,monitor,verb,"to watch a situation carefully for a period of time in order to discover something about it",ˈmɒn.ɪ.tə
Unit 7,mount,verb,"to fix something on a wall, in a frame etc., so that it can be viewed or used",maʊnt
Unit 7,on a first-come-first-served basis ,adverb phrase,"used to mean that people will receive something or be dealt with in the order in which they ask or arrive",ɒn eɪ ˈfɜːst kʌm ˈfɜːst sɜːvd ˈbeɪ.sɪs
Unit 7,project management,noun phrase,"the activity of organizing and controlling a project",prəʊˈdʒekt ˈmæn.ɪdʒ.mənt
Unit 7,ready-made equipment,noun phrase,"the machinery, tools, etc. that you need to do a job in a finished form and available to use immediately",ˈred.i.meɪd ɪˈkwɪp.mənt
Unit 7,registration,noun,"when a name or information is recorded on an official list",ˌredʒ.ɪˈstreɪ.ʃən
Unit 7,sales technique,noun phrase,"the ability to persuade people to buy a company's products or services",seɪlz tekˈniːk
Unit 7,trade event,noun phrase,"a large event at which companies show and sell their products and try to increase their business",treɪd ɪˈvent
Unit 7,win new business,verb phrase,"to succeed in getting more people or companies to buy your goods or services",wɪn njuː ˈbɪz.nɪs
Unit 8,acquire,verb,"to get something",əˈkwaɪə
Unit 8,anchor,verb,"to make something or someone stay in one position",ˈæŋ.kə
Unit 8,blag ,verb,"manage to obtain something by using persuasion",blæg
Unit 8,financial gain,noun phrase,"with the purpose or aim of making money, rather than for any other reason",faɪˈnæn.tʃəl ɡeɪn
Unit 8,give a discount ,verb phrase,"to offer a reduction in the usual price of a product or service",ɡɪv eɪ dɪˈskaʊnt
Unit 8,give and take,noun phrase,"willingness to accept suggestions from another person and give up some of your own",ɡɪv ənd teɪk
Unit 8,give up on the first reversal ,verb phrase,"to stop doing something because of the first problem or failure in the process",ɡɪv ʌp ɒn ðiː ˈfɜːst rɪˈvɜː.səl
Unit 8,identify needs,verb phrase,"to find and be able to describe something that you must have to achieve a particular thing",aɪˈden.tɪ.faɪ niːdz
Unit 8,know their limits ,verb phrase,"If someone knows their limits, they are aware of the greatest amount of something that is possible for them to do.",nəʊ ðeə ˈlɪmɪts
Unit 8,make a profit ,verb phrase,"to earn money in trade or business, especially after paying the costs of producing and selling goods and services",meɪk eɪ ˈprɒf.ɪt
Unit 8,novelty value ,noun phrase,"interesting because it has not been experienced before" ,ˈnɒv.əl.ti ˈvæl.juː
Unit 8,opening proposal,noun phrase,"a formal suggestion, plan, or idea that comes near the beginning of something",ˈəʊp.nɪŋ prəˈpəʊ.zəl
Unit 8,persistent,adjective,"Someone who is persistent continues doing something or tries to do something in a determined way".,pəˈsɪs.tənt
Unit 8,place a repeat order ,verb phrase,"to order the same thing that you have ordered before",pleɪs eɪ rɪˈpiːt ˈɔː.də
Unit 8,pushy ,adjective,"behaving in an unpleasant way by trying too much to get something or to make someone do something",ˈpʊʃ.i
Unit 8,trustworthy ,adjective,"able to be trusted",ˈtrʌstˌwɜː.ði
Unit 9,achieve an ambition,verb phrase,"to successfully do something you wanted to do, especially after a lot of effort",əˈtʃiːv ˈæn æmˈbɪʃ.ən
Unit 9,buy into a franchise,verb phrase,"to pay money for the right for your business to sell the products and services of another company",baɪ ˈɪn.tə eɪ ˈfræn.tʃaɪz
Unit 9,cash infusion,noun phrase,"when money is added to a business to make it stronger or better",kæʃ ɪnˈfjuː.ʒən
Unit 9,close down,phrasal verb,"if a business or organisation closes down or someone closes it down, it stops operating",kləʊs daʊn
Unit 9,cope with,phrasal verb,"to deal successfully with a difficult situation",kəʊp wɪð
Unit 9,credit facilities,noun phrase,"arrangements for paying for goods or services at a later time, usually paying interest as well as the original amount",ˈkred.ɪt fəˈsɪl.ə.tiz
Unit 9,economic trend,noun phrase,"a general development relating to trade, industry, and money",ˌiː.kəˈnɒm.ɪk trend
Unit 9,entrepreneur ,noun,"someone who makes money by starting their own business, especially when this involves seeing a new opportunity and taking risks",ˌɒn.trə.prəˈnɜː
Unit 9,exploit a gap in the market,verb phrase,"to use the opportunity to sell a product or service because a need or demand for it exists but no one is supplying it",ɪkˈsplɔɪt eɪ ɡæp ɪn ðiː ˈmɑː.kɪt
Unit 9,from strength to strength ,adverb phrase,gradually becoming more successful,frɒm streŋkθ tuː streŋkθ
Unit 9,international presence,noun phrase,"when someone or something is known in more than one country",ˌɪn.təˈnæʃ.ən.əl ˈprez.ənts
Unit 9,lay out guidelines,verb phrase,"to give information intended to advise people on how something should be done in a clear and detailed way"   ,leɪ aʊt ˈɡaɪd.laɪnz
Unit 9,lose one's head,verb phrase,"to lose control and not act in a calm way",luːz ðeə hedz
Unit 9,make redundant,verb phrase,"If you are made redundant you lose your job because your employer no longer needs you".,meɪk rɪˈdʌn.dənt
Unit 9,new venture,noun phrase,"a new business activity" ,njuː ˈven.tʃə
Unit 9,outlet,noun,"a store that sells a particular company's products or products of a specific type",ˈaʊt.let
Unit 9,premises,plural noun,"the buildings and land owned or used by someone, especially by a company or organisation",ˈprem.ɪ.sɪz
Unit 9,replicate the core concept,verb phrase,"to make or do the most important part of a business's idea again in exactly the same way",ˈrep.lɪ.keɪt ðiː kɔː ˈkɒn.sept
Unit 9,revenue stream,noun phrase,"the money coming into a company from a particular activity over a period of time, or the activity itself",ˈrev.ən.juː striːm
Unit 9,roll out,phrasal verb,"to make a new product, service, or system available for the first time",ˈrəʊl aʊt
Unit 9,sign a contract,verb phrase,"to write your name on a legal document that states and explains a formal agreement between two different people or groups",saɪn eɪ kənˈtrækt
Unit 9,social status,noun phrase, "the level or position of someone in relation to others in society",ˈsəʊ.ʃəl ˈsteɪ.təs
Unit 9,survey,noun,"an examination of people's opinions, behaviour, etc. made, for example, by asking them questions",səˈveɪ
Unit 9,take charge of ,verb phrase,"to take control of something or of a group of people",teɪk tʃɑːdʒ ɒv
Unit 9,take the plunge ,verb phrase,"to make a decision to do something, especially after thinking about it for a long time",teɪk ðiː plʌndʒ
Unit 9,tight lending market,noun phrase,"when the activity of lending money to people and organisations which they pay back with interest is controlled very carefully",taɪt len.dɪŋ ˈmɑː.kɪt
Unit 9,time-consuming,adjective,"taking a lot of time to do or complete",ˈtaɪm.kənˌsjuː.mɪŋ
Unit 9,tone down,phrasal verb,"to make something less forceful or offensive, usually a piece of writing or a speech",təʊn daʊn
Unit 9,wealthy,adjective,rich,ˈwel.θi
Unit 10,build up a business ,verb phrase,"to increase the activity of buying and selling goods and services in quantity and make it stronger",bɪld ʌp eɪ ˈbɪz.nɪs
Unit 10,business plan ,noun phrase,"a detailed document describing the future plans of a business",ˈbɪz.nɪs plæn
Unit 10,cold-call ,verb,"to phone or visit a possible customer to try to sell them a product or service without being asked by the customer to do so",
Unit 10,competitive ate ,noun phrase,"an amount or level of payment that is as good as or better than other amounts or levels of payment",kəmˈpet.ɪ.tɪv reɪt
Unit 10,consolidated shipments ,noun phrase,"combinations of large amounts of goods sent together to a place",kənˈsɒl.ɪ.deɪt ˈʃɪp.mənts
Unit 10,create employment,verb phrase,"to make jobs exist",kriˈeɪt ɪmˈplɔɪ.mənt
Unit 10,currency ,noun,"the system of money that is used in a particular country at a particular time",ˈkʌr.ənt.si
Unit 10,debt,noun,"the amount of money that is owed by a person, company, country, etc. and that they usually have to pay interest on",det
Unit 10,delivery on time ,noun phrase,"the act of taking goods, letters, parcels, etc. to a place, done when it should be and is not late",dɪˈlɪv.ər.i ɒn taɪm
Unit 10,distributor,noun,"a person or company that buys products from a manufacturer and sells them for a profit to other businesses, stores, or customers, often by transporting the goods to different places",
Unit 10,encroach ,verb,"to gradually cover more and more of an area",ɪnˈkrəʊtʃ
Unit 10,freight company ,noun phrase,"a business that transports goods by ship, aircraft, train, or truck",freɪt ˈkʌm.pə.ni
Unit 10,go about ,phrasal verb,"to begin to do something or deal with something",ɡəʊ əˈbaʊt
Unit 10,guarantee the loan,verb phrase,"If you guarantee someone's loan you formally promise to accept the responsibility for paying the money back if the person fails to pay it".,ˌɡær.ənˈtiː ðiː ləʊn
Unit 10,invoice ,noun ,"a document that lists things provided or work done, gives their cost, and asks for payment",ˈɪn.vɔɪs
Unit 10,joint owners,noun phrase,"two or more people who own something",dʒɔɪnt əʊn.əz
Unit 10,market sector ,noun phrase,"a part of an industry, or a group of customers, products, etc. that are similar in some way",ˈmɑː.kɪt ˈsek.tə
Unit 10,meet monthly repayments ,verb phrase,"to have enough money to pay amounts you owe every month",miːt mʌntθ.li rɪˈpeɪ.mənts
Unit 10,partnership,noun,"an agreement between organisations, people, etc. to work together",ˈpɑːt.nə.ʃɪp
Unit 10,principal payment,noun phrase,"a payment made to pay back all or part of a loan, rather than to pay interest on the loan",ˈprɪnt.sə.pəl ˈpeɪ.mənt
Unit 10,profit potential,noun phrase,"something that is able to develop into earning money in the future when the necessary conditions exist",ˈprɒf.ɪt pəʊˈten.tʃəl
Unit 10,prosper ,verb,"to be or become successful, especially financially",ˈprɒs.pə
Unit 10,recession ,noun ,"a period, usually at least six months, of low economic activity, when investments lose value, businesses fail, and unemployment rises",rɪˈseʃ.ən
Unit 10,savings,plural noun,"money that you keep, usually in a bank account, instead of spending it",seɪvɪŋs
Unit 10,ship in ,phrasal verb,"to send something, usually a large object or a large quantity of objects or people, to a place far away",ʃɪp ɪn
Unit 10,track back ,phrasal verb,"to record the progress or development of something over a period of past time",træk bæk
Unit 11,at current exchange ates ,noun phrase,"at the rate at which the money of one country can be changed for the money of another country at the present time",ət ˈkʌr.ənt ɪksˈtʃeɪndʒ reɪts
Unit 11,award a contract,verb phrase,"to have a formal agreement with a company for them to provide a service or do a job",əˈwɔːd eɪ kənˈtrækt
Unit 11,commission,verb,"to ask someone to do a particular piece of work for you",kəˈmɪʃ.ən
Unit 11,course of action,noun phrase,"the way something happens, or a way of doing something",kɔːs ɒv ˈæk.ʃən
Unit 11,cross-fertilisation of ideas,noun phrase,"the mixing of the ideas of different places or groups of people, to make it better for all",krɒsˌfɜː.tɪ.laɪˈzeɪ.ʃən ɒv aɪˈdɪəz
Unit 11,cutting edge technology,noun phrase,"the practical, especially industrial, use of all the latest scientific discoveries  ",kʌtɪŋ edʒ tekˈnɒl.ə.dʒi
Unit 11,divisional head,noun ,"a person who is in charge of one part of a large organisation",dɪˈvɪʒ.ən.əl hed
Unit 11,enjoy a reputation,verb phrase,"to have an advantage because people have a good opinion of someone or something",ɪnˈdʒɔɪ eɪ ˌrep.jəˈteɪ.ʃən
Unit 11,entity,noun ,"something which exists apart from other things, having its own independent existence",ˈen.tɪ.ti
Unit 11,get down to ,verb phrase,"to start to direct your efforts and attention towards something",ɡet daʊn tuː
Unit 11,get on to ,phrasal verb,"to speak or write to a person or organisation because you want them to help you in some way",ɡet ˈɒn tuː
Unit 11,ground-breaking,adjective,"new and likely to have an effect on how things are done in the future",ˈɡraʊndˌbreɪ.kɪŋ
Unit 11,head up ,phrasal verb,"to lead or manage a team, department, organisation, etc.",hed ʌp
Unit 11,infrastructure,noun,"the basic systems and services that are needed in order to support an economy, for example, transport and communication systems and electricity and water supplies",ˈɪn.frəˌstrʌk.tʃə
Unit 11,interested party,noun phrase,"any people or organisations who may be affected by a situation, or who are hoping to make money out of a situation",ˈɪn.trəst.ɪd ˈpɑː.ti
Unit 11,lease,noun,"an agreement to pay money in order to use land, a building, a vehicle, or a piece of equipment for a particular period of time",liːs
Unit 11,on a world scale,adverb phrase,"used to measure or compare the level of something around the world",ɒn eɪ wɜːld skeɪl
Unit 11,purpose-built facility,noun phrase,a building or area that is designed and built for a particular use,ˈpɜː.pəs.bɪlt fəˈsɪl.ə.ti
Unit 11,R & D facility,noun phrase,"a building or area for research and development (= the part of an organisation that works to improve its products and develop new ones, or the activity of doing this)",ˈɑː.ənd.ˌdiː fəˈsɪl.ə.ti
Unit 11,rank highest,verb phrase,"to have a position that is higher than others, or to be considered to have such a position",ræŋk haɪ.əst
Unit 11,run a growing operation ,verb phrase,"to be in control of or manage a business organisation that is getting bigger",rʌn eɪ ɡrəʊɪŋ ˌɒp.ərˈeɪ.ʃən
Unit 11,step across the threshold,verb phrase,(formal) "to go into a building or room",step əˈkrɒs ðiː ˈθreʃ.həʊld
Unit 11,tax question,noun phrase,"a sentence or phrase used to find out information about money paid to the government",tæks ˈkwes.tʃən
Unit 11,too many strings attached ,noun phrase,"If something such as an agreement has too many strings attached, it involves too large a number of special demands or limits.",tuː ˈmen.i strɪŋz əˈtætʃt
Unit 11,viable alternative,noun phrase,"something that is different from something else, especially from what is usual, but is able to be done or likely to succeed",ˈvaɪ.ə.bəl ɔːlˈtɜː.nə.tɪv
Unit 12,advance their career,verb phrase,"to do things that help them to progress to better jobs and become successful",ədˈvɑːnts ðeə kəˈrɪə
Unit 12,brainstorm,verb,"to meet in a group to suggest a lot of new ideas very quickly, with the intention of considering them more carefully later",ˈbreɪn.stɔːm
Unit 12,breakdown of costs ,noun phrase,"a division of how money needs to be spent, so that you can see all the details",ˈbreɪk.daʊn ɒv kɒsts
Unit 12,credible,adjective,"able to be believed or trusted",ˈkred.ə.bəl
Unit 12,demand ,noun ,"a need for goods or services that customers want to buy/use",dɪˈmɑːnd
Unit 12,dry up,phrasal verb,"to stop being able to talk in the normal way",draɪ ʌp
Unit 12,feel free,verb phrase,"If someone tells you to feel free to do something, they mean that you can do it if you want to.",fiːl friː
Unit 12,finding ,noun ,"information or a fact that is discovered by studying something",faɪndɪŋ
Unit 12,handout,noun,a document containing information that is given to people at a meeting or other event,ˈhænd.aʊt
Unit 12,mannerism,noun,"something that a person does repeatedly with their face, hands or voice, and which they may not realise they are doing",ˈmæn.ər.ɪ.zəm
Unit 12,outline a requirement ,verb phrase,"to give the main facts about something that you need",ˈaʊt.laɪn rɪˈkwaɪə.mənt
Unit 12,potential return ,noun phrase,"the amount of profit made by an investment or a business activity that is able to grow in the future",pəʊˈten.tʃəl rɪˈtɜːn
Unit 12,prompt,noun,"words that help people to remember what they are going to say" ,prɒmpt
Unit 12,reduce anxiety,verb phrase,to make uncomfortable feelings of nervousness smaller in degree,rɪˈdʒuːs æŋˈzaɪ.ə.ti
Unit 12,rehearse,verb ,"to practise a play, a piece of music, etc. in order to prepare it for public performance",rɪˈhɜːs
Unit 12,sound investment ,noun phrase,"when you put money, effort, time, etc. into something to make a profit in a way that shows good judgment",saʊnd ɪnˈvest.mənt
Unit 13,avoid pitfalls ,verb phrase,"to prevent likely mistakes or problems in a situation from happening" ,əˈvɔɪd ˈpɪt.fɔːlz
Unit 13,build team spirit ,verb phrase,"to improve ways of thinking and acting that shows loyalty to your team and its members",bɪld tiːm ˈspɪr.ɪt
Unit 13,cash in on,phrasal verb,"to get money or another advantage from an event or situation, often in an unfair way",kæʃ ɪn ɒn
Unit 13,check in,phrasal verb,"to show your ticket at an airport so that you can be told where you will be sitting and so that your bags can be put on the aircraft",ˈtʃek ɪn
Unit 13,flight status,noun phrase,"the situation at the present time about when an aircraft that is making a particular journey is likely to arrive or depart" ,flaɪt ˈsteɪ.təs
Unit 13,get off to a dreadful start ,verb phrase,"to begin an activity very badly",ɡet ɒf tuː eɪ ˈdred.fəl stɑːt
Unit 13,loyalty programme,noun phrase,"a scheme rewarding customers for buying goods or services from a particular store or company",ˈlɔɪ.əl.ti ˈprəʊ.ɡræm
Unit 13,review,noun,"a report that contains important information about a particular subject or activity",rɪˈvjuː
Unit 13,search engine,noun phrase,"a computer program that finds information on the Internet by looking for words that you have typed in a box on the screen",sɜːtʃ ˈen.dʒɪn
Unit 13,social network,noun phrase,"a website that allows users to post messages, information, images etc to other users",ˈsəʊ.ʃəl ˈnet.wɜːk
Unit 13,working hours,plural noun ,"the amount of time someone spends at work during a day",wɜːkɪŋ aʊəz
Unit 14,behind the scenes ,adverb phrase,"If something happens behind the scenes, it happens without most people knowing about it, especially when something else is happening publicly.",bɪˌhaɪnd ðə siːnz
Unit 14,boom ,verb,"to experience an increase in economic activity, interest or growth",buːm
Unit 14,broaden the potential,verb phrase,"to increase the ability of something to develop, achieve or succeed",ˈbrɔː.dən ðiː pəʊˈten.tʃəl
Unit 14,cater to ,phrasal verb,"to try to satisfy a need",ˈkeɪ.tə tuː
Unit 14,circumstantial,adjective,"happening because of a particular situation",ˌsɜː.kəmˈstæn.tʃəl
Unit 14,clear,verb,"to give official permission for something",klɪə
Unit 14,collaboration,noun,"the act of working together with other people or organisations to create or achieve something",kəˌlæb.əˈreɪ.ʃən
Unit 14,counter-intuitive advice,noun phrase,"an opinion which someone offers you about what you should do in a particular situation which is not what you expect",ˈkaʊn.tə ɪnˈtʃuː.ɪ.tɪv ədˈvaɪs
Unit 14,cut off a conversation,verb phrase,"to stop a conversation suddenly",kʌt ɒf eɪ ˌkɒn.vəˈseɪ.ʃən
Unit 14,delegate,noun,"a person who is chosen or elected by a group to speak or vote for it, especially at a meeting",ˈdel.ɪ.ɡeɪt
Unit 14,estimate ,noun,"a statement for a possible customer about how much a piece of work should cost",ˈes.tɪ.meɪt
Unit 14,financial implication ,noun phrase ,"the effect that an action or decision relating to money will have on something or someone",faɪˈnæn.tʃəl ˌɪm.plɪˈkeɪ.ʃən
Unit 14,in due course ,adverb phrase,"at a suitable time in the future",ɪn dʒuː kɔːs
Unit 14,industry peer,noun phrase,"a person who has a similar job to other people  involved in one type of business",ˈɪn.də.stri pɪə
Unit 14,let an opportunity slip ,verb phrase,"to not use the possibility of doing something that you want to do or have to do ",let ˈæn ˌɒp.əˈtʃuː.nə.ti slɪp
Unit 14,old hand ,noun phrase,"someone who is very experienced and skilled in a particular area of activity",əʊld hænd
Unit 14,on request ,adverb phrase,"If something is available on request, you have to ask for it if you want it.",ɒn rɪˈkwest
Unit 14,pen drive ,noun phrase,"a  flash drive (= a small object for storing electronic data that can be connected to a computer and that can be carried about easily)",pen draɪv
Unit 14,stroke of luck,noun phrase,"when something good happens suddenly by chance",strəʊk əv lʌk
Unit 14,up-and-coming ,adjective,"likely to achieve success soon or in the near future",ˌʌp.ə ndˈkʌm.ɪŋ
Unit 14,within close proximity to ,adverb phrase,"the state of being very near in space or time",wɪˈðɪn kləʊs prɒkˈsɪm.ə.ti tuː
Unit 15,accountability,noun,"a situation in which someone is responsible for things that happen and can give a satisfactory reason for them",əˌkaʊn.təˈbɪl.ə.ti
Unit 15,agenda,noun,"a list of things to be discussed during a meeting",əˈdʒen.də
Unit 15,bias,noun,"the fact of allowing personal opinions to influence your judgement in an unfair way",ˈbaɪ.əs
Unit 15,chair,noun ,"a person who is in charge of a meeting",tʃeə
Unit 15,circulate,verb,"to send something such as information, ideas or documents from one person to another",ˈsɜː.kjə.leɪt
Unit 15,end in chaos ,verb phrase,"to finish in a state of total confusion with no order",end ɪn ˈkeɪ.ɒs
Unit 15,face to face,"adverb phrase, adjective phrase","used to describe a situation in which you talk directly to another person, not by phone, email, online, etc.",ˌfeɪs tuː ˈfeɪs
Unit 15,know-how,noun,"practical knowledge, experience, and ability",ˈnəʊ.haʊ
Unit 15,meeting venue,noun phrase,"the place where a meeting happens",ˈmiː.t̬ɪŋ ˈven.juː
Unit 15,minutes,plural noun ,"the written record of what was said and decided at a meeting",ˈmɪn.ɪts
Unit 15,morale,noun,"the level of satisfaction felt by a person or group of people who work together",məˈrɑːl
Unit 15,productive ,adjective,"achieving good results",prəˈdʌk.tɪv
Unit 15,reach a conclusion ,verb phrase,"to make a decision about something",riːtʃ eɪ kənˈkluː.ʒən
Unit 16,correlation,noun,"a connection between two or more things, especially when one of them causes or influences the other",ˌkɒr.əˈleɪ.ʃən
Unit 16,front-office staff,noun phrase,"the people working in a company, bank, etc. who deal directly with customers",frʌnt ˈɒf.ɪs stɑːf
Unit 16,lucrative,adjective,"earning or producing a lot of money",ˈluː.krə.tɪv
Unit 16,on the basis that,phrase,"the reason why someone does something or why something happens",ɒn ðiː ˈbeɪ.sɪs ðæt
Unit 16,poor sales performance,noun phrase,"earning or producing only a small amount of money",pɔː seɪlz pəˈfɔː.mənts
Unit 16,rep,noun," abbreviation for 'sales representative': "someone whose job is to sell a company's products or services, especially when this involves travelling to meet people or speaking to them on the phone",rep
Unit 17,align,verb,"to change something so that it has a correct relationship to something else",əˈlaɪn
Unit 17,at the last count ,phrase,"when something was counted most recently",ət ðiː lɑːst kaʊnt
Unit 17,business function,noun phrase ,"a particular area of responsibility of a company",ˈbɪz.nɪs ˈfʌŋk.ʃən
Unit 17,counter-productive  ,adjective,"having an opposite effect to the one that was wanted, and therefore harmful",ˌkaʊn.tə.prəˈdʌk.tɪv
Unit 17,engage with,phrasal verb ,"to become involved with someone",ɪnˈɡeɪdʒ wɪð
Unit 17,hurt their budgets ,verb phrase,"reduce the amount of money you have available to spend",hɜːt ðeə ˈbʌdʒɪts
Unit 17,in an official capacity ,noun phrase,"as part of a particular position or job",ɪn ˈæn əˈfɪʃ.əl kəˈpæs.ə.ti
Unit 17,insight,noun,"a clear, deep and sometimes sudden understanding of a complicated problem or situation",ˈɪn.saɪt
Unit 17,intrinsically motivated,adjective phrase,"wanting to do something well as a basic characteristic of a person",ɪnˈtrɪnt.sɪk.li ˈməʊ.tɪv.eɪ.tɪd
Unit 17,next to nothing ,noun phrase,"almost nothing; very little",nekst tuː ˈnʌθ.ɪŋ
Unit 17,provoke a negative reaction R,verb phrase,"to do something that causes a bad feeling in people",prəˈvəʊk eɪ ˈneɡ.ə.tɪv riˈæk.ʃən
Unit 17,special offer ,noun phrase,"goods that are sold at a lower price than usual",ˈspeʃ.əl ˈɒf.ə
Unit 17,too good to miss ,adjective phrase,"if you say that something is too good to miss, you mean that it is a very good opportunity and that people should see it, do it, etc",tuː ɡʊd tuː mɪs
Unit 17,webinar,noun,"an occasion when a group of people go online at the same time to study or discuss something",ˈweb.ɪ.nɑː
Unit 18,anti-pollution law,noun phrase," a rule, usually made by a government, that is opposed to or against damage caused to water, air, etc. by harmful substances or waste",ˈæn.ti pəˈluː.ʃən lɔː
Unit 18,boot up,phrasal verb,"when a computer boots (up), it becomes ready for use by getting the necessary information into its memory, and when you boot (up) a computer, you cause it to do this",buːt ʌp
Unit 18,breakdown in the system,noun phrase,"the failure  of a way of doing things  to work as it should",ˈbreɪk.daʊn ɪn ðiː ˈsɪs.təm
Unit 18,clean-air legislation,noun phrase,"a law or set of laws intended to prevent gases that harm the environment from being sent out into the air",kliːn eə ˌledʒ.ɪˈsleɪ.ʃən
Unit 18,climate change,noun phrase,"changes in the world's weather, particularly an increase in temperature, thought to be caused by things such as carbon dioxide in the atmosphere",ˈklaɪ.mət tʃeɪndʒ
Unit 18,emission ,noun phrase,"an amount of something, especially a gas that harms the environment, that is sent out into the air",iˈmɪʃ.ən
Unit 18,environmentally friendly,adjective phrase,"designed or operating in a way that does not harm the environment",ɪnˌvaɪə.rənˌmen.təl.iˈfrend.li
Unit 18,feature,noun,"something that makes a product, machine, or system different, and usually better, than others of a similar type",ˈfiː.tʃə
Unit 18,fraction,noun,"a small part or amount of something",ˈfræk.ʃən
Unit 18,get staff involved,verb phrase,"to include people who work in a particular business in something, or to make them take part in or feel part of it",ɡet stɑːf ɪnˈvɒlvd
Unit 18,in nature,phrase,"as the type or main characteristic of something",ɪn ˈneɪ.tʃə
Unit 18,in practice,phrase,"If something is true in practice, this is the real situation.",ɪn ˈpræk.tɪs
Unit 18,legal action,noun phrase,"the process of using lawyers, courts of law, etc. to solve disagreements, or an occasion when this happens",ˈliː.ɡəl ˈæk.ʃən
Unit 18,production process,noun phrase,"a method of producing goods",prəˈdʌk.ʃən prəʊˈses
Unit 18,recycle,verb,"to collect and treat rubbish in order to produce useful materials which can be used again",ˌriːˈsaɪ.kəl
Unit 18,rent ,noun,"the amount of money that you pay to rent something for a period of time",rent
Unit 18,research lab ,noun,"a room or building with scientific equipment where detailed study of a subject is done",rɪˈsɜːtʃ læb
Unit 18,resign,verb,to say that you have decided to leave your job,rɪˈzaɪn
Unit 18,resource,noun,"a useful or valuable possession or quality of a country, organisation or person",rɪˈzɔːs
Unit 18,seek planning permission ,verb phrase,to try to get an official agreement that something new can be built or an existing building can be changed,siːk plæn.ɪŋ pəˈmɪʃ.ən
Unit 18,service charge ,noun,an amount of money paid to the owner of an apartment or office building for services such as cleaning and repairs,ˈsɜː.vɪs tʃɑːdʒ
Unit 18,socially responsible,adjective phrase,working or operating in ways that are not harmful to society or the environment,ˈsəʊ.ʃəli rɪˈspɒnt.sə.bəl
Unit 18,the paperless office,noun phrase,"a room or part of a building in which people work where information is kept on computers, not on paper",ðiː ˈpeɪ.pə.ləs ˈɒf.ɪs
Unit 18,waste,noun,"materials or substances with no use or value, for example, ones that are produced when other products are being made",weɪst
Unit 18,waste power,verb phrase,to use too much electricity or use it badly ,weɪst ˈpaʊ.ə
Unit 18,work remotely ,verb phrase,employees who work remotely work mainly from home and communicate with the company by email and telephone,wɜːk rɪˈməʊtli
Unit 19,absenteeism,noun ,"the fact of staying away from work, especially without a good reason",ˌæb.sənˈtiːɪ.zəm
Unit 19,at peak times ,adverb phrase,"at a time of day when a lot of people are using the same service, such as the Internet, phone, etc",ət piːk taɪmz
Unit 19,balance sheet ,noun ,a financial statement that shows a company's assets and debts at a particular time,ˈbæl.ənts ʃiːt
Unit 19,bandwidth ,noun ,"the amount of information that can be sent between computers, over a phone line, using radio signals, etc. in a particular amount of time",ˈbænd.wɪtθ
Unit 19,board meeting ,noun ,an occasion when a group of people who are responsible for making rules and decisions on behalf of an organisation meet in order to discuss something,bɔːd ˈmiː.t̬ɪŋ
Unit 19,cashflow ,noun ,"the movement of money into and out of a company's accounts, used as a measure of how much money the company spends and receives and how much profit it makes over a particular period of time",ˈkæʃ.fləʊ
Unit 19,channel ideas ,verb phrase,to use suggestions or plans for doing something in a particular way,ˈtʃæn.əl aɪˈdɪəz
Unit 19,come in someone's emit ,verb phrase,to be responsible for a particular area of work,kʌm ɪn jɔː ɪˈmɪt
Unit 19,cut down on ,verb phrase,to reduce the amount or number of something,kʌt daʊn ɒn
Unit 19,extra workload ,noun phrase,a more-than-usual amount of work that a person or machine has to do within a particular period of time,ˈek.strə ˈwɜːk.ləʊd
Unit 19,implement change ,verb phrase,to put the process of making something different into action,ˈɪm.plɪ.ment tʃeɪndʒ
Unit 19,keep up with orders ,verb phrase,to stay level with requests from customers for goods or services,kiːp ʌp wɪð ˈɔː.dəz
Unit 19,on schedule,adverb phrase,not early or late,ɒn ˈʃedʒ.uːl
Unit 19,on the shop floor ,adverb phrase,among the ordinary workers at a factory,ɒn ðiː ʃɒp flɔː
Unit 19,output ,noun,"the amount of goods and services, or waste products, that are produced by a particular economy, industry, company, or worker",ˈaʊt.pʊt
Unit 19,powers that be ,noun phrase,important people who have authority over others,pɑːs ɒn
Unit 19,profit and loss ,noun phrase,money that is earned or lost in trade or business,ˈprɒf.ɪt ænd lɒs
Unit 19,rush hour ,noun phrase ,"one of the very busy times of the day on roads, trains, etc., in the morning when people are travelling to work and in the evening when people are going home",ðiː rʌʃ aʊə
Unit 19,service provider ,noun,a company that provides internet connections and services,ˈsɜː.vɪs prəʊˈvaɪ.də
Unit 19,sick leave ,noun,a period of time that a worker is allowed to be away from work because they are ill,sɪk liːv
Unit 19,staff turnover,noun phrase,the rate at which employees leave a company and are replaced by new employees,stɑːf ˈtɜːnˌəʊ.və
Unit 19,tie sthg in with ,phrasal verb,to plan something so that it happens as part of another activity,ˈtaɪ.ɪn
Unit 19,track orders in real time ,verb phrase,to follow the movement or progress of requests from customers in the very short amount of time needed for computer systems to receive data and information and then communicate it or make it available ,træk ˈɔː.dəz ɪn rɪəl taɪm
Unit 19,working conditions ,plural noun,the physical situation that someone works in or is affected by,wɜːk.ɪŋ kənˈdɪʃ.ənz
Unit 20,after-sales service,noun phrase,the business activity that involves doing things for customers provided after they have paid for and received a product or service,ˈɑːf.tə seɪlz ˈsɜː.vɪs
Unit 20,base salary,noun phrase,"basic salary: the amount of money that someone earns every year in their job, not including any extra payments they may receive",beɪs ˈsæl.ər.i
Unit 20,benefits,plural noun,"advantages such as medical insurance, life insurance and sick pay, that employees receive from their employer in addition to money",ˈben.ɪ.fɪt
Unit 20,bookkeeping,noun,the activity of keeping records of all the money a company spends and receives,ˈbʊkˌkiː.pɪŋ
Unit 20,cashflow projection,noun phrase,a calculation or guess about the future movement of money into and out of a company's accounts based on information that you have ,ˈkæʃ.fləʊ prəʊˈdʒek.ʃən
Unit 20,cloud-based approach ,noun phrase,"the use of technology, services, software, etc. on the Internet rather than software and hardware that you buy and install on your computer",klaʊd beɪst əˈprəʊtʃ
Unit 20,coding of systems ,noun phrase,"to represent information in a way that is not ordinary language, as with special signs or symbols, to make it easier to trade them between countries",kəʊd.ɪŋ ɒv ˈsɪs.təmz
Unit 20,competitive advantage ,noun phrase,"the conditions that make a business more successful than the businesses it is competing with, or a particular thing that makes it more successful",kəmˈpet.ɪ.tɪv ədˈvɑːn.tɪdʒ
Unit 20,data centre ,noun phrase,a place where a number of computers that contain large amounts of information can be kept safely,ˈdeɪ.tə sɜːv.ə
Unit 20,dissatisfied customer,noun phrase, a person who buys a product or service and feels that it is not as good as it should be,dɪsˈsæt.ɪsfaɪd ˈkʌs.tə.mə
Unit 20,emergency hotline,noun phrase,a special direct telephone line that people can use for dangerous or serious situations,ɪˈmɜː.dʒənt.si ˈhɒt.laɪn
Unit 20,file sharing,noun phrase,"the practice of distributing computer files, for example, images, films, or music, among several computers",faɪl ʃeər.ɪŋ
Unit 20,geeky ,adjective,"used to describe someone who knows a lot about science or technology, especially computers",ˈɡiː.ki
Unit 20,graphic design,noun phrase,"the skill or the work of arranging text and pictures, especially in the production of books, magazines, software, etc.",ˈɡræf.ɪk dɪˈzaɪn
Unit 20,log on ,phrasal verb,to connect to a computer system by putting in a particular set of letters or numbers,lɒɡ ɒn
Unit 20,monthly retainer,noun phrase,an amount of money that you pay to someone in order to be sure that they can work for you when you need them to,mʌntθli rɪˈteɪnə
Unit 20,net new clients,verb phrase,to be successful in getting new customers to buy goods or services from your business,net njuː ˈklaɪ.ənts
Unit 20,payroll tax,noun phrase,"any tax that is based on employees' pay, and is either paid by an employer or partly taken by an employer from what employees earn",ˈpeɪ.rəʊl tæks
Unit 20,people person ,noun phrase,someone who is good at dealing with other people,ˈpiː.pəl ˈpɜː.sən
Unit 20,perception ,noun ,"the way that someone thinks and feels about a company, product, service, etc.",pəˈsep.ʃən
Unit 20,realise cost savings,verb phrase,to make money or a profit from spending less money than was planned,ˈrɪə.laɪz kɒst seɪv.ɪŋz
Unit 20,redundant site,noun phrase,"a place on the Internet which is no longer needed where a person, company, or organisation can give information about their products or services ",rɪˈdʌn.dənt saɪt
Unit 20,server,noun ,a central computer that controls and provides information to other computers in a network,sɜːvə
Unit 20,storage,noun ,"the act of keeping things somewhere so that they can be used later, especially goods or energy supplies",ˈstɔː.rɪdʒ
Unit 20,time zone,noun phrase,"one of the 24 parts into which the world is divided. The time in each zone is one hour earlier than in the zone east of it, and one hour later than in the zone west of it",taɪm zəʊn
Unit 20,virus infection,noun phrase,a harmful computer program intended to prevent computers from working normally,ˈvaɪə.rəs ɪnˈfek.ʃən
Unit 20,website hosting,noun phrase,providing the computer equipment and software necessary for a website to be available on the Internet,ˈweb.saɪt həʊst.ɪŋ
Unit 21,bring in ,phrasal verb,to introduce something new such as a product,brɪŋ ɪn
Unit 21,car dealership,noun phrase,a company that has permission to sell particular cars,kɑː ˈdiː.lə.ʃɪp
Unit 21,deal with ,phrasal verb,to take action in order to achieve something or in order to solve a problem,diːl wɪð
Unit 21,employee attitude,noun phrase,"the feelings that someone who is paid to work for someone else has, and the way this makes them behave",ɪmˈplɔɪ.iː ˈæt.ɪ.tʃuːd
Unit 21,integrity,noun ,the quality of being honest and having strong moral principles that you refuse to change,ɪnˈteɡ.rə.ti
Unit 21,provider of choice,noun phrase, the most popular company or organisation that sells a particular type of product or service,prəʊˈvaɪd.ə ɒv tʃɔɪs
Unit 21,repeat customer,noun phrase,someone who buys again from a company that they have used before,rɪˈpiːt ˈkʌs.tə.mə
Unit 21,responsiveness,noun,used for talking about how quickly and well a person or organisation reacts to something,rɪˈspɒnt.sɪv.nɪs
Unit 21,teamwork,noun,"the activity of working together as a team, or the skills needed to do this",ˈtiːm.wɜːk
Unit 21,voucher ,noun,"a printed piece of paper used to pay for particular goods or services, or to pay less than the usual price",ˈvaʊ.tʃə
Unit 22,build long-term relationships R,verb phrase,to create and develop ways of connecting with people over a long period of time,bɪld lɒŋ tɜːm rɪˈleɪ.ʃən.ʃɪps
Unit 22,call-centre operative,noun phrase,"a person who works in a large office in which a company's employees provide information to its customers, or sell or advertise its goods or services by telephone",kɔːl ˈsen.tə ˈɒp.ər.ə.tɪv
Unit 22,clear up ,phrasal verb,"to give or find an explanation for something, or to deal with a problem or argument",klɪə ʌp
Unit 22,exceed expectation,verb phrase,to be even better than you were expecting,ɪkˈsiːd ˌek.spekˈteɪ.ʃən
Unit 22,extend your customer base,verb phrase,to increase the size or range of the group of people who buy or use a company's products or services,ɪkˈstend jɔː ˈkʌs.tə.mə beɪs
Unit 22,handle an awkward customer,verb phrase,to deal with a difficult person who is buying your product or service successfully,ˈhæn.dəl ˈæn ˈɔː.kwəd ˈkʌs.tə.mə
Unit 22,helpline,noun,a telephone service provided by an organisation or company to offer help and advice to people,ˈhelp.laɪn
Unit 22,lack of people skills,noun phrase,not enough ability to deal with people in a friendly and effective way that achieves good results,læk ɒv ˈpiː.pəl skɪlz
Unit 22,point of purchase,noun phrase,a place such as a store where a product is bought,pɔɪnt ɒv ˈpɜː.tʃəs
Unit 22,project professionalism,verb phrase,"to have the combination of all the qualities that are connected with trained and skilled people, in a way that people notice ",prəʊˈdʒekt prəˈfeʃ.ən.əl.ɪ.zəm
Unit 22,rapport,noun ,a good understanding of someone and an ability to communicate well with them,ræpˈɔː
Unit 22,retain a customer,verb phrase,to keep or continue to have a person or an organisation that buys a product or service,rɪˈteɪn eɪ ˈkʌs.tə.mə
Unit 22,reward,verb,"to give someone money or other advantages in exchange for good behaviour or good work, etc",rɪˈwɔːd
Unit 22,valuable feedback,noun phrase,"useful information about something such as a new product or someone's work, that provides an idea of whether people like it or whether it is good",ˈvæl.jʊ.bəl ˈfiːd.bæk
Unit 22,written brief ,noun,instructions  on a piece of paper that explain what someone's work or task is ,ˈrɪt.ən briːf
Unit 23,have a lot on one’s plate ,verb phrase,to have a large amount of important work to deal with,hæv eɪ lɒt ɒn wʌn pleɪt
Unit 23,line manager,noun,someone directly in charge of workers,laɪn ˈmæn.ɪ.dʒə
Unit 23,work long hours,verb phrase,to do a job for a large amount of time,wɜːk lɒŋ aʊəz
Unit 24,aptitude testing,noun phrase,a test to find out whether someone has a natural ability for a particular type of work,ˈæp.tɪ.tʃuːd test.ɪŋ
Unit 24,autocratic ,adjective,"controlled by one leader who has total power, and who does not allow anyone else to make decisions",ˌɔː.təˈkræt.ɪk
Unit 24,best predictor,noun phrase,"the best way of saying what will happen in the future, based on knowledge or experience",best prɪˈdɪk.tə
Unit 24,career progression ,noun phrase,the process of making progress to better jobs,kəˈrɪə prəʊˈɡreʃ.ən
Unit 24,corporate client ,noun phrase,a large business that receives professional services from an organisation,ˈkɔː.pər.ət ˈklaɪ.ənt
Unit 24,culture-bound construct,noun phrase,an idea based on the way of life or customs and beliefs of a particular group of people at a particular time,ˈkʌl.tʃə baʊnd kənˈstrʌkt
Unit 24,entry level ,noun phrase,"at or relating to the lowest level of an organisation, type of work, etc.",ˈen.tri ˈlev.əl
Unit 24,expat assignment,noun phrase,"the process of giving someone who does not live in their own country a particular job, task, or responsibility",ˌekˈspæt əˈsaɪn.mənt
Unit 24,fill the position,verb phrase,to employ someone to do a job,fɪl ðiː pəˈzɪʃ.ən
Unit 24,fit into their context ,verb phrase,to do something that is accepted in the existing situation ,fɪt ˈɪn.tə ðeə ˈkɒn.tekst
Unit 24,intangible,adjective,"used about a feeling or quality that does not exist in a physical way, or that is difficult to describe",ɪnˈtæn.dʒə.bəl
Unit 24,integrate with local business culture R,verb phrase,to become part of the ideas and ways of working of an organisation in a particular place,ˈɪn.tɪ.ɡreɪt wɪð ˈləʊ.kəl ˈbɪz.nɪs ˈkʌl.tʃə
Unit 24,integrated marketing plan ,noun phrase,"the business activity that involves finding out what customers want, using that information to design products and services, and selling them effectively, in a combined form ",ˈɪn.tɪɡreɪ.tɪd ˈmɑːkɪ.tɪŋ plæn
Unit 24,international track record,noun phrase,all the achievements or failures that someone or something has had in the past involving more than one country,ˌɪn.təˈnæʃ.ən.əl træk rɪˈkɔːd
Unit 24,middleman ,noun,a person or company that buys goods from the company that has produced them and makes a profit by selling them to a store or a user,ˈmɪd.əl.mæn
Unit 24,pass this first hurdle,verb phrase,to have to solve a problem at the start of something before you can make progress,pɑːs ðɪs ˈfɜːst ˈhɜː.dəl
Unit 24,post the position,verb phrase,to advertise that a job is available ,pəʊst ðiː pəˈzɪʃ.ən
Unit 24,psychometric testing,noun phrase,"the activity of using tests that are designed to show someone's personality, mental ability, opinions, etc., in order to decide whether or not to employ them",ˌsaɪ.kəʊˈmet.rɪk test.ɪŋ
Unit 24,risk-averse,adjective,not wanting to take risks,rɪsk əˈvɜːs
Unit 24,service line ,noun phrase,"a range of similar business activities that are sold by the same company, with different features and different prices",ˈsɜː.vɪs laɪn
Unit 24,soft skill ,noun phrase,"a particular ability, idea, or knowledge that helps a business to be successful",sɒft skɪl
Unit 24,standard business norm,noun phrase,a way of buying and selling goods and services or doing things that is generally accepted,ˈstæn.dəd ˈbɪz.nɪs nɔːm
Unit 24,steep learning curve,noun phrase,the rate of someone's progress in learning a very difficult new skill,stiːp lɜːn.ɪŋ kɜːv
Unit 24,straightforward ,adjective,easy to understand or simple,ˌstreɪtˈfɔː.wəd
Unit 24,take lightly,verb phrase,to treat in a way that is not serious,teɪk laɪt.li
Unit 24,take up employment ,verb phrase,to start doing a new job,teɪk ʌp ɪmˈplɔɪ.mənt
Unit 24,transferable skill ,noun phrase,a particular ability used in one job or career that can also be used in another,træntˈsfɜː.rə.bəl skɪl
Unit 24,withstand the rigours,verb phrase,to deal with unpleasant or severe conditions successfully,wɪðˈstænd ðiː ˈrɪg.əs;

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
