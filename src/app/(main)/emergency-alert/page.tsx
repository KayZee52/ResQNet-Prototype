
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PanicButton } from "@/components/features/panic-button";
import { MapPin, Mic, Send, UploadCloud, ShieldAlert, Flame, Stethoscope, HelpCircle, Users, Contact } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export default function EmergencyAlertPage() {
  const [emergencyType, setEmergencyType] = useState("");
  const [location, setLocation] = useState("Fetching location...");
  const [voiceNoteStatus, setVoiceNoteStatus] = useState("No voice note recorded.");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [broadcastToCommunity, setBroadcastToCommunity] = useState(true);
  const [alertEmergencyContacts, setAlertEmergencyContacts] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setLocation("Unable to retrieve location. Please enable GPS.");
          toast({ variant: "destructive", title: "Location Error", description: "Please enable GPS for accurate location." });
        }
      );
    } else {
      setLocation("Geolocation is not supported by this browser.");
    }
  }, [toast]);

  const handleRecordVoiceNote = () => {
    setVoiceNoteStatus("Recording... (Feature in development)");
    toast({ title: "Voice Note", description: "Voice recording started (simulated)." });
    // Simulate recording
    setTimeout(() => setVoiceNoteStatus("Voice note recorded (mock)."), 2000);
  };

  const handleAddPhoto = () => {
    toast({ title: "Add Photo", description: "Photo upload feature is in development." });
    // Placeholder for photo upload logic
  };

  const handleSendAlert = async (isPanicButtonPress: boolean = false) => {
    if (!emergencyType && !isPanicButtonPress) { // For form submission, type is required
      toast({ variant: "destructive", title: "Error", description: "Please select an emergency type." });
      return;
    }
    setIsSending(true);

    // Simulate alert sending
    console.log("Sending Alert:", {
      emergencyType: isPanicButtonPress && !emergencyType ? "Unknown" : emergencyType,
      location,
      voiceNote: voiceNoteStatus.includes("recorded"),
      additionalInfo,
      broadcastToCommunity,
      alertEmergencyContacts,
      photoAttached: false, // Placeholder
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({ 
      title: "SOS Alert Sent!", 
      description: `Emergency alert (${isPanicButtonPress && !emergencyType ? "Unknown" : emergencyType || "Unknown"}) dispatched with your location. Responders notified.`,
      duration: 5000,
    });
    setIsSending(false);
    // Potentially navigate to a post-alert status screen here in the future
  };

  const emergencyTypes = [
    { value: "medical", label: "Medical", icon: <Stethoscope className="mr-2 h-4 w-4" /> },
    { value: "fire", label: "Fire", icon: <Flame className="mr-2 h-4 w-4" /> },
    { value: "crime_threat", label: "Crime/Threat", icon: <ShieldAlert className="mr-2 h-4 w-4" /> },
    { value: "unknown", label: "Unknown/Other", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto min-h-screen p-4">
      <Card className="w-full max-w-lg mx-auto mt-4 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-destructive">Emergency Alert Panel</CardTitle>
          <CardDescription>Instantly send a distress alert. Stay calm, help is on the way.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center my-6">
            <PanicButton 
              size="lg" 
              buttonText="PRESS SOS" 
              onClick={() => handleSendAlert(true)} 
              className={isSending ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyType" className="text-md font-semibold">What's the emergency?</Label>
            <Select onValueChange={setEmergencyType} value={emergencyType} disabled={isSending}>
              <SelectTrigger id="emergencyType" className="text-base">
                <SelectValue placeholder="Select emergency type (optional for quick SOS)" />
              </SelectTrigger>
              <SelectContent>
                {emergencyTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-md border-b pb-2">Broadcast Settings</h3>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="broadcastToCommunity" className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4 text-primary" />
                  Broadcast to community responders
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alerts nearby ResQNet volunteers.
                </p>
              </div>
              <Switch
                id="broadcastToCommunity"
                checked={broadcastToCommunity}
                onCheckedChange={setBroadcastToCommunity}
                disabled={isSending}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
               <div className="space-y-0.5">
                <Label htmlFor="alertEmergencyContacts" className="text-sm font-medium flex items-center">
                  <Contact className="mr-2 h-4 w-4 text-primary" />
                  Alert my emergency contacts
                </Label>
                 <p className="text-xs text-muted-foreground">
                  Notifies contacts from your medical profile.
                </p>
              </div>
              <Checkbox
                id="alertEmergencyContacts"
                checked={alertEmergencyContacts}
                onCheckedChange={(checked) => setAlertEmergencyContacts(Boolean(checked))}
                disabled={isSending}
                className="h-5 w-5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-md font-semibold">Optional Details</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleRecordVoiceNote} disabled={isSending} className="w-full">
                <Mic className="mr-2 h-4 w-4" /> Record Voice Note
              </Button>
              <Button variant="outline" onClick={handleAddPhoto} disabled={isSending} className="w-full">
                <UploadCloud className="mr-2 h-4 w-4" /> Add Photo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pl-1">{voiceNoteStatus}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Text Description (Optional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="e.g., 'Trapped in back room, smoke increasing' or 'Person is unconscious, difficulty breathing'"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Your Location (GPS)</Label>
            <div className="flex items-center space-x-2 rounded-md border p-3 text-sm bg-muted/50">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{location}</span>
            </div>
          </div>

          <Button onClick={() => handleSendAlert(false)} className="w-full bg-destructive hover:bg-destructive/90" size="lg" disabled={isSending}>
            {isSending ? (
              <>
                <Send className="mr-2 h-5 w-5 animate-pulse" /> Sending Alert...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" /> Send Alert with Details
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
