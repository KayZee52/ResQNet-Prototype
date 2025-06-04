
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label"; // Added missing import
import {
  HeartPulse, Flame, Droplets, ShieldAlert, CarFront, Baby, Brain, Ban, FlaskConical, Bandage, Search, ChevronDown, ChevronUp, DownloadCloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FirstAidTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  content: string[];
  imageHint: string;
  reminders?: string[];
  sosContext?: string; // Optional context for SOS alert
}

const firstAidTopicsData: FirstAidTopic[] = [
  {
    id: "cpr",
    title: "CPR / Unconsciousness",
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    description: "Cardiopulmonary Resuscitation for unresponsive individuals.",
    content: [
      "Check for responsiveness. Shout and gently tap the person.",
      "Call for emergency help immediately or ask someone to call.",
      "If unresponsive and not breathing or only gasping, begin chest compressions.",
      "Push hard and fast in the center of the chest at a rate of 100-120 compressions per minute.",
      "If trained, give 2 rescue breaths after every 30 compressions.",
      "Continue until help arrives or the person starts to breathe.",
    ],
    reminders: [
      "Ensure the scene is safe before approaching.",
      "Do not give rescue breaths if you are not trained or comfortable doing so; continuous chest compressions are most important.",
      "Do not stop compressions for more than 10 seconds.",
    ],
    imageHint: "medical cpr",
    sosContext: "Unresponsive person, possible CPR needed",
  },
  {
    id: "burns",
    title: "Treating Burns",
    icon: <Flame className="h-8 w-8 text-primary" />,
    description: "First aid for thermal, chemical, or electrical burns.",
    content: [
      "Stop the burning process: Cool the burn with cool (not ice-cold) running water for 10-20 minutes.",
      "Remove jewelry or tight clothing from the burned area before it swells, if possible.",
      "Cover the burn with a sterile non-stick dressing or clean cloth.",
      "Do not apply ointments, butter, or other home remedies to severe burns.",
      "For major burns (large, deep, or on face/hands/feet/genitals), call emergency services immediately.",
    ],
    reminders: [
      "Do not break blisters.",
      "For chemical burns, brush off any dry chemical powder before flushing with water.",
      "For electrical burns, ensure the power source is off before approaching the person.",
    ],
    imageHint: "burn firstaid",
    sosContext: "Burn injury",
  },
  {
    id: "bleeding",
    title: "Controlling Severe Bleeding",
    icon: <Droplets className="h-8 w-8 text-primary" />,
    description: "Steps to manage and control heavy bleeding.",
    content: [
      "Call for emergency help immediately.",
      "Ensure your own safety (e.g., wear gloves if available).",
      "Apply direct, firm pressure to the wound using a clean cloth or sterile dressing.",
      "Elevate the injured part above the heart if possible, unless you suspect a broken bone.",
      "If bleeding is severe and doesn't stop with direct pressure, consider using a tourniquet if trained and it's a life-threatening situation on a limb. Note the time it was applied.",
      "Keep the person warm and reassured.",
    ],
    reminders: [
      "Do not remove any objects embedded in the wound; apply pressure around it.",
      "If the first cloth soaks through, add another on top; do not remove the first one.",
    ],
    imageHint: "injury accident",
    sosContext: "Severe bleeding",
  },
  {
    id: "snakebites",
    title: "Snakebite Emergency",
    icon: <ShieldAlert className="h-8 w-8 text-primary" />,
    description: "Immediate actions to take for a snakebite.",
    content: [
      "Call emergency services immediately. Identify the snake only if it can be done safely.",
      "Keep the person calm and still. Restrict movement as much as possible.",
      "Position the bitten limb lower than the heart if possible.",
      "Do NOT apply a tourniquet or cut the wound.",
      "Do NOT try to suck out the venom.",
      "Remove any tight clothing or jewelry from the bitten limb as swelling may occur.",
      "Note the time of the bite and any symptoms.",
    ],
    reminders: [
      "Assume the snake is venomous unless proven otherwise.",
      "Do not give the person anything to eat or drink, especially alcohol or caffeine.",
    ],
    imageHint: "snake reptile",
    sosContext: "Snakebite incident",
  },
  {
    id: "road_accidents",
    title: "Road Accidents",
    icon: <CarFront className="h-8 w-8 text-primary" />,
    description: "Initial response to a road traffic accident.",
    content: [
      "Ensure your own safety first. Check for hazards like traffic or fire.",
      "Call emergency services immediately (police, ambulance, fire brigade).",
      "Do not move casualties unless they are in immediate danger (e.g., fire).",
      "If safe, switch off the ignition of involved vehicles.",
      "Check for responsiveness and breathing in casualties.",
      "Control any severe bleeding. Provide CPR if necessary and trained.",
      "Keep casualties warm and reassured.",
    ],
    reminders: [
      "Do not remove a motorcyclist's helmet unless essential for airway management.",
      "Be aware of potential fuel spills or electrical hazards.",
    ],
    imageHint: "car accident",
    sosContext: "Road accident",
  },
  {
    id: "childbirth_infant_aid",
    title: "Childbirth & Infant Aid",
    icon: <Baby className="h-8 w-8 text-primary" />,
    description: "Emergency childbirth and basic infant first aid.",
    content: [
      "For emergency childbirth: Call emergency services. Stay calm. Support the mother. Prepare clean towels/sheets. As baby is born, support head and shoulders. Dry baby and keep warm.",
      "For infant choking (conscious): Give 5 back blows, then 5 chest thrusts. Repeat.",
      "For infant CPR: Use 2 fingers for chest compressions. Cover baby's mouth and nose with your mouth for rescue breaths.",
    ],
    reminders: [
      "Always prioritize calling professional medical help.",
      "Infant first aid techniques differ significantly from adults.",
    ],
    imageHint: "newborn baby",
    sosContext: "Childbirth or infant emergency",
  },
  {
    id: "stroke_seizure",
    title: "Stroke / Seizure",
    icon: <Brain className="h-8 w-8 text-primary" />,
    description: "Recognizing and responding to strokes and seizures.",
    content: [
      "Stroke (FAST): Face drooping? Arm weakness? Speech difficulty? Time to call emergency services.",
      "During a seizure: Protect the person from injury (clear area, cushion head). Do not restrain. Do not put anything in their mouth. Time the seizure.",
      "After a seizure: Place person in recovery position. Stay with them until they are fully awake. Call emergency services if seizure lasts >5 mins, occurs in water, person is injured, pregnant, or has diabetes.",
    ],
    reminders: [
      "For stroke, rapid medical attention is crucial.",
      "For seizures, focus on safety and observation.",
    ],
    imageHint: "brain health",
    sosContext: "Suspected stroke or seizure",
  },
  {
    id: "allergic_reaction",
    title: "Allergic Reaction (Anaphylaxis)",
    icon: <Ban className="h-8 w-8 text-primary" />,
    description: "Dealing with severe allergic reactions.",
    content: [
      "Recognize signs: Difficulty breathing, swelling (face, lips, tongue), rash, dizziness, collapse.",
      "Call emergency services immediately.",
      "If the person has an epinephrine auto-injector (e.g., EpiPen), help them use it or administer it if trained.",
      "Lay the person flat with legs elevated (unless breathing difficulty, then sit them up).",
      "If unresponsive and not breathing, start CPR.",
    ],
    reminders: [
      "Anaphylaxis is life-threatening; act quickly.",
      "Even if symptoms improve after auto-injector, medical attention is still required.",
    ],
    imageHint: "allergy medical",
    sosContext: "Severe allergic reaction",
  },
  {
    id: "poisoning",
    title: "Poisoning / Ingestion",
    icon: <FlaskConical className="h-8 w-8 text-primary" />,
    description: "First aid for suspected poisoning.",
    content: [
      "Call emergency services or poison control center immediately.",
      "Try to identify what was ingested, how much, and when.",
      "Do NOT induce vomiting unless instructed by medical professionals.",
      "If poison is on skin or clothes, remove contaminated clothing and rinse skin with water.",
      "If poison is in eyes, flush eyes with lukewarm water for 15-20 minutes.",
      "If person is unresponsive, check breathing and start CPR if needed.",
    ],
    reminders: [
      "Keep any suspected poison containers or labels for medical personnel.",
      "Follow instructions from emergency services or poison control precisely.",
    ],
    imageHint: "chemical hazard",
    sosContext: "Suspected poisoning",
  },
  {
    id: "wound_care",
    title: "General Wound Care",
    icon: <Bandage className="h-8 w-8 text-primary" />,
    description: "Basic care for minor cuts, scrapes, and puncture wounds.",
    content: [
      "Wash your hands thoroughly.",
      "Stop bleeding by applying gentle pressure with a clean cloth.",
      "Clean the wound with cool water. Remove any dirt or debris with tweezers cleaned with alcohol.",
      "Apply a thin layer of antibiotic ointment (if available and no allergy).",
      "Cover the wound with a sterile bandage or dressing.",
      "Change the dressing daily or if it becomes wet or dirty.",
      "Watch for signs of infection (redness, swelling, pus, fever).",
    ],
    reminders: [
      "For deep wounds, animal bites, or if bleeding doesn't stop, seek medical attention.",
      "Ensure tetanus immunization is up to date.",
    ],
    imageHint: "bandage medical",
    sosContext: "Wound requiring attention",
  },
];


export default function FirstAidCenterPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadsEnabled, setDownloadsEnabled] = useState(true); // Mock state
  const [downloadProgress, setDownloadProgress] = useState("8 of 10 guides downloaded."); // Mock state

  const handleDownloadToggle = (checked: boolean) => {
    setDownloadsEnabled(checked);
    if (checked) {
      toast({ title: "Offline Downloads Enabled", description: "Guides will be downloaded when available." });
      // Simulate download initiation
      setDownloadProgress("Downloading all guides...");
      setTimeout(() => setDownloadProgress("All guides downloaded and available offline."), 3000);
    } else {
      toast({ title: "Offline Downloads Disabled" });
      setDownloadProgress("Downloads paused.");
    }
  };

  const filteredTopics = firstAidTopicsData.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 pb-20">
      <Card className="w-full max-w-3xl mx-auto mt-4 shadow-lg mb-6">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">First Aid Center</CardTitle>
          <CardDescription>
            Quick access to emergency first aid instructions. Search or browse categories below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for CPR, bleeding, burns..."
              className="w-full pl-10 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl mx-auto shadow-md mb-6">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <DownloadCloud className="mr-2 h-6 w-6 text-primary" />
            Offline Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="offline-download-toggle" className="text-base">Download guides for offline use</Label>
            <Switch
              id="offline-download-toggle"
              checked={downloadsEnabled}
              onCheckedChange={handleDownloadToggle}
            />
          </div>
          <p className="text-sm text-muted-foreground">{downloadProgress}</p>
        </CardContent>
      </Card>
      
      {filteredTopics.length > 0 ? (
        <Accordion type="multiple" className="w-full max-w-3xl mx-auto space-y-3">
          {filteredTopics.map((topic) => (
            <AccordionItem value={topic.id} key={topic.id} className="rounded-lg border bg-card shadow-sm">
              <AccordionTrigger className="p-4 hover:no-underline text-left">
                <div className="flex items-center space-x-4 w-full">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {topic.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline text-lg leading-tight">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{topic.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2">
                <h4 className="font-semibold text-md mb-2">Steps to Follow:</h4>
                <ul className="list-disc space-y-2 pl-5 text-foreground mb-4">
                  {topic.content.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>

                {topic.reminders && topic.reminders.length > 0 && (
                  <>
                    <h4 className="font-semibold text-md mb-2">Important Reminders:</h4>
                    <ul className="list-disc space-y-1 pl-5 text-muted-foreground mb-4">
                      {topic.reminders.map((reminder, index) => (
                        <li key={index}>{reminder}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                <div className="my-4 bg-muted rounded-md overflow-hidden">
                  <img
                    src={`https://placehold.co/600x300.png`}
                    alt={`${topic.title} illustration`}
                    className="w-full h-auto object-cover"
                    data-ai-hint={topic.imageHint}
                  />
                </div>
                 <p className="mt-2 text-xs text-muted-foreground">
                  (Visual aids and audio instructions will be enhanced with offline downloads.)
                </p>

                <Link href={`/emergency-alert?context=${encodeURIComponent(topic.sosContext || topic.title)}`} passHref className="mt-4 block">
                  <Button variant="destructive" className="w-full">
                    <ShieldAlert className="mr-2 h-5 w-5" /> Activate SOS Alert Now
                  </Button>
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="w-full max-w-3xl mx-auto mt-6 text-center">
          <CardContent className="p-6">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No guides found for "{searchTerm}".</p>
            <p className="text-muted-foreground">Try a different search term or browse all guides.</p>
          </CardContent>
        </Card>
      )}
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        This guide is for informational purposes only. Always seek professional medical help for emergencies.
      </p>
    </div>
  );
}
    

    