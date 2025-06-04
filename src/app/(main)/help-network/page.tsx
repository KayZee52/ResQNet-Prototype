
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { VolunteerCard, type Volunteer } from "@/components/features/volunteer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, MessageCircle, Map, Users, ShieldAlert, CheckCircle, Radio, Mic, Camera, MapPin, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const dummyVolunteers: Volunteer[] = [
  {
    id: "1",
    name: "Alice 'Health Angel' Smith",
    distance: "0.5 km",
    isVerified: true,
    skills: ["CPR", "First Aid", "Pediatrics"],
    avatarUrl: "https://placehold.co/128x128.png",
    status: "Online",
    responderType: "Verified Paramedic",
  },
  {
    id: "2",
    name: "Bob Johnson",
    distance: "1.2 km",
    isVerified: false,
    skills: ["Basic Life Support", "Community Watch"],
    avatarUrl: "https://placehold.co/128x128.png",
    status: "Online",
    responderType: "Community Helper",
  },
  {
    id: "3",
    name: "Carol Williams",
    distance: "2.0 km",
    isVerified: true,
    skills: ["Advanced First Aid", "Trauma Care", "Mental Health First Aid"],
    avatarUrl: "https://placehold.co/128x128.png",
    status: "Busy",
    responderType: "Verified Nurse",
  },
  {
    id: "4",
    name: "David 'Safety Dave' Brown",
    distance: "2.5 km",
    isVerified: true,
    skills: ["Fire Safety", "Search & Rescue Basics"],
    avatarUrl: "https://placehold.co/128x128.png",
    status: "Offline",
    responderType: "Retired Firefighter",
  },
];

export default function HelpNetworkPage() {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRequestHelpModalOpen, setIsRequestHelpModalOpen] = useState(false);
  const [helpRequestType, setHelpRequestType] = useState("");
  const [helpRequestMessage, setHelpRequestMessage] = useState("");
  const { toast } = useToast();

  const filteredVolunteers = dummyVolunteers
    .filter(v => !showVerifiedOnly || v.isVerified)
    .filter(v => 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.responderType.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSendHelpRequest = () => {
    if (!helpRequestType || !helpRequestMessage) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select an emergency type and provide a message."});
      return;
    }
    toast({ title: "Help Request Sent", description: "Nearby responders have been notified (simulated)." });
    console.log("Help Request:", { type: helpRequestType, message: helpRequestMessage, location: "User's Current Location (simulated)" });
    setHelpRequestMessage("");
    setHelpRequestType("");
    setIsRequestHelpModalOpen(false);
  };
  
  const handleRecordVoiceNote = () => {
    toast({ title: "Voice Note", description: "Voice recording for help request is in development." });
  };

  const handleAddPhoto = () => {
    toast({ title: "Add Photo", description: "Photo upload for help request is in development." });
  };


  return (
    <div className="container mx-auto p-4 pb-20">
      <Card className="w-full max-w-4xl mx-auto mt-4 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">Community Help Around You</CardTitle>
          <CardDescription>View and connect with nearby responders or request assistance.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Map className="mr-2 h-6 w-6 text-primary"/>Live Map Overview</CardTitle>
          <CardDescription>Visual representation of nearby help. (Interactive map in development)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-md bg-sky-100 dark:bg-sky-900 relative border-2 border-primary/10 shadow-inner">
            {/* Mock land masses */}
            <div className="absolute top-1/4 left-1/6 w-1/3 h-1/2 bg-green-200 dark:bg-green-800 opacity-50 rounded-lg blur-sm"></div>
            <div className="absolute top-1/5 right-1/6 w-1/4 h-2/3 bg-lime-200 dark:bg-lime-800 opacity-40 rounded-full blur-sm"></div>

            {/* User's location (blue dot) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                 {/* Optional: <div className="w-2 h-2 bg-blue-200 rounded-full animate-ping absolute"></div> */}
              </div>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/70 dark:bg-black/70 px-1 rounded">You</span>
            </div>

            {/* Nearby responders (green pins) */}
            <div className="absolute top-1/3 left-1/4 z-10" title="Responder 1">
              <MapPin className="h-7 w-7 text-green-600 dark:text-green-400 fill-green-500/50 dark:fill-green-300/50" />
            </div>
            <div className="absolute bottom-1/4 right-1/3 z-10" title="Responder 2">
              <MapPin className="h-7 w-7 text-green-600 dark:text-green-400 fill-green-500/50 dark:fill-green-300/50" />
            </div>
             <div className="absolute top-2/3 right-1/5 z-10" title="Responder 3">
              <MapPin className="h-7 w-7 text-green-600 dark:text-green-400 fill-green-500/50 dark:fill-green-300/50" />
            </div>

            {/* Active alert area (red zone) */}
            <div className="absolute top-1/4 right-1/4 z-10" title="Active Alert">
              <div className="w-10 h-10 bg-red-500/30 rounded-full animate-pulse flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-400" />
              </div>
            </div>
            
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 dark:bg-foreground/80 text-foreground dark:text-background text-xs rounded shadow">
              Map Mockup
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="verified-toggle"
              checked={showVerifiedOnly}
              onCheckedChange={setShowVerifiedOnly}
            />
            <Label htmlFor="verified-toggle" className="text-sm">Show only Verified Responders</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Users className="mr-2 h-6 w-6 text-primary"/>Nearby Responders</CardTitle>
          <div className="mt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, skill, or type..." 
                className="pl-10 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((volunteer) => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No responders match your current filters.</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl mx-auto mt-6 bg-primary/5 text-center">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Become a Local Hero</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Want to help others in your community and make a difference during emergencies?</p>
          <Link href="/join-responder-program" passHref>
            <Button size="lg">
              <CheckCircle className="mr-2 h-5 w-5"/> Join as a Responder
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">(Leads to sign-up, training, and certification)</p>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl mx-auto mt-6 border-l-4 border-yellow-400">
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center"><Radio className="mr-2 h-5 w-5 text-yellow-500"/>Emergency Broadcasts (Example)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Card className="p-3 bg-destructive/10 border-destructive">
            <p className="text-sm font-medium text-destructive-foreground">🚨 2 minutes ago – Janet (200m away) needs help: ‘My child fainted.’</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="destructive" size="sm"><ShieldAlert className="mr-1 h-4 w-4"/>Mark as Responding</Button>
              <Button variant="outline" size="sm"><Map className="mr-1 h-4 w-4"/>Navigate</Button>
              <Button variant="outline" size="sm"><MessageCircle className="mr-1 h-4 w-4"/>Chat Securely</Button>
            </div>
          </Card>
           <p className="text-xs text-muted-foreground">This is a placeholder for real-time emergency broadcast notifications. Actual implementation is a future feature.</p>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl mx-auto mt-6 border-l-4 border-blue-400">
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-blue-500"/>Community Score & Trust (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track your contributions, ratings, and responder level. Compete on leaderboards and build trust within the ResQNet community.
            This feature is under development.
          </p>
        </CardContent>
      </Card>


      {/* Floating Action Button for Request Local Help */}
      <Dialog open={isRequestHelpModalOpen} onOpenChange={setIsRequestHelpModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-xl p-0 z-40 animate-pulse sm:bottom-6 sm:right-6"
            aria-label="Request Local Help"
            onClick={() => setIsRequestHelpModalOpen(true)}
          >
            <PlusCircle className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Request Local Help</DialogTitle>
            <DialogDescription>
              Describe your situation. Nearby available responders will be notified. Your location will be shared.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="help-request-type">What's happening?</Label>
              <Select onValueChange={setHelpRequestType} value={helpRequestType}>
                <SelectTrigger id="help-request-type">
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical_assist">Medical Assistance (e.g., fall, injury)</SelectItem>
                  <SelectItem value="safety_concern">Safety Concern (e.g., suspicious activity)</SelectItem>
                  <SelectItem value="stuck_vehicle">Stuck Vehicle / Roadside</SelectItem>
                  <SelectItem value="lost_pet_person">Lost Pet or Person</SelectItem>
                  <SelectItem value="other">Other General Assistance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="help-request-message">Add a message (required)</Label>
              <Textarea
                id="help-request-message"
                placeholder="e.g., 'Elderly person fell, needs help getting up' or 'Suspicious person seen near park'"
                value={helpRequestMessage}
                onChange={(e) => setHelpRequestMessage(e.target.value)}
                rows={3}
              />
            </div>
             <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleRecordVoiceNote} className="w-full">
                <Mic className="mr-2 h-4 w-4" /> Add Voice Note
              </Button>
              <Button variant="outline" onClick={handleAddPhoto} className="w-full">
                <Camera className="mr-2 h-4 w-4" /> Add Photo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Voice and photo features are illustrative for now.</p>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={handleSendHelpRequest} className="w-full sm:w-auto">
              Send Help Request
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsRequestHelpModalOpen(false)} className="w-full sm:w-auto mt-2 sm:mt-0">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

