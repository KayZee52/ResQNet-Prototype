
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanicButton } from "@/components/features/panic-button";
import { Progress } from "@/components/ui/progress";
import { Bell, LifeBuoy, Mic, Users, Award, MapPin, DownloadCloud, CheckCircle2, AlertTriangle, ArrowRight, Info, Radio, UserSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";


// Types for status indicators and feature cards
interface StatusIndicatorProps {
  name: string;
  ready: boolean;
  icon: React.ReactNode;
}

interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

// Reusable Feature Card component for the grid
function FeatureCard({ href, icon, title, description, children }: FeatureCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transform transition-all hover:scale-105 hover:shadow-lg flex flex-col text-center p-4">
        {/* Content Area: This will take up available space */}
        <div className="flex-grow flex flex-col items-center w-full">
          {/* Icon, Title, Description part */}
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
            {icon}
          </div>
          <CardTitle className="font-headline text-md mb-1">{title}</CardTitle>
          <CardDescription className="text-xs mb-2 px-1">{description}</CardDescription>
          
          {/* Children part (e.g., progress bar for training) - displayed below description */}
          {children && (
            <div className="w-full mt-2">
              {children}
            </div>
          )}
        </div>

        {/* Button Area: Pushed to the bottom by flex-grow above and mt-auto */}
        <div className="mt-auto pt-2"> {/* pt-2 to give a little space above button */}
          <Button variant="ghost" size="sm" className="text-primary text-xs py-1 px-2 h-auto">
            Open <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default function HomeDashboardPage() {
  const [greeting, setGreeting] = useState("Hi Kelvin, ready to stay safe today?");
  const [isBroadcasting, setIsBroadcasting] = useState(false); // Example state for broadcast

  useEffect(() => {
    const hour = new Date().getHours();
    let dynamicGreeting = "Hi Kelvin, ";
    if (hour < 12) dynamicGreeting += "Good Morning! Ready to stay safe today?";
    else if (hour < 18) dynamicGreeting += "Good Afternoon! Ready to stay safe today?";
    else dynamicGreeting += "Good Evening! Ready to stay safe today?";
    setGreeting(dynamicGreeting);

    // Simulate broadcast status for demonstration
    // setTimeout(() => setIsBroadcasting(true), 5000);
  }, []);

  const emergencyTip = "Tip: In case of fire, crawl low under smoke.";
  const statuses: StatusIndicatorProps[] = [
    { name: "GPS Active", ready: true, icon: <MapPin className="h-4 w-4 mr-1" /> },
    { name: "Contacts OK", ready: true, icon: <UserSquare className="h-4 w-4 mr-1" /> },
    { name: "Offline Pack", ready: true, icon: <DownloadCloud className="h-4 w-4 mr-1" /> },
  ];

  const featureCards: FeatureCardProps[] = [
    { title: "Quick First Aid", href: "/first-aid", icon: <LifeBuoy className="h-8 w-8" />, description: "Popular quick guides" },
    { title: "Talk to AI Assistant", href: "/ai-assistant", icon: <Mic className="h-8 w-8" />, description: "Speak or type for guidance" },
    { title: "Find Nearby Help", href: "/help-network", icon: <Users className="h-8 w-8" />, description: "Community Help Network" },
  ];
  
  // Training Card specific data
  const trainingProgress = 60; // Example progress
  const userBadge = "Silver First Responder";


  return (
    <div className="container mx-auto p-4 pb-20"> {/* Increased pb for nav */}
      {/* 1. Header Section */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-foreground">{greeting}</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </header>

      {/* 2. Status/Context Bar */}
      <Card className="mb-6 shadow">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-2 text-primary shrink-0" />
            <p>{emergencyTip}</p>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {statuses.map(status => (
              <div key={status.name} className={`flex items-center p-1 rounded-sm ${status.ready ? 'text-green-600' : 'text-yellow-600'}`}>
                {status.ready ? <CheckCircle2 className="h-3 w-3 mr-1 shrink-0" /> : <AlertTriangle className="h-3 w-3 mr-1 shrink-0" />}
                {status.icon}
                <span>{status.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Feature Cards */}
      {/* Panic Button Card - Dominant */}
      <Card className="mb-6 bg-destructive/10 border-destructive shadow-xl transform transition-all hover:scale-[1.02]">
        {/* The Link component was removed here. PanicButton handles its own navigation. */}
        <CardContent className="p-4 flex flex-col items-center text-center">
          <PanicButton size="default" showLabel={false} className="mb-2 animate-pulse-red" />
          <CardTitle className="font-headline text-xl text-destructive mb-1">Tap in Emergency</CardTitle>
          <CardDescription className="text-destructive/80 text-xs">Long-press for confirmation (UX detail for future)</CardDescription>
        </CardContent>
      </Card>

      {/* Grid for other feature cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {featureCards.map(card => (
          <FeatureCard key={card.title} {...card} />
        ))}
        {/* Start Training / View Certificate Card */}
        <FeatureCard
          href="/training"
          icon={<Award className="h-8 w-8" />}
          title="Your Training"
          description="Safety & First Aid Modules"
        >
          <div className="w-full px-2 mt-2">
            <Progress value={trainingProgress} className="h-2 mb-1" />
            <p className="text-xs text-primary font-medium">{userBadge}</p>
            <p className="text-xs text-muted-foreground">{trainingProgress}% complete</p>
          </div>
        </FeatureCard>
      </div>
      
      {/* 4. Broadcast Status (optional) */}
      {isBroadcasting && (
        <Card className="mb-6 bg-blue-50 border-blue-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-700 font-headline text-lg flex items-center"><Radio className="h-5 w-5 mr-2"/>Broadcast Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600 mb-3">3 neighbors responding to your alert.</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 hover:bg-blue-100">View Responders</Button>
              <Button variant="outline" size="sm" onClick={() => setIsBroadcasting(false)} className="border-muted-foreground text-muted-foreground hover:bg-muted/50">End Alert</Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
