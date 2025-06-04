
"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, ShieldCheck, MapPin, CheckCircle, AlertCircle, HelpCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface Volunteer {
  id: string;
  name: string; // Or nickname
  distance: string;
  isVerified: boolean;
  skills: string[];
  avatarUrl: string;
  status: "Online" | "Offline" | "Busy";
  responderType: string; // e.g., "Verified First Aider", "Community Helper"
}

interface VolunteerCardProps {
  volunteer: Volunteer;
}

export function VolunteerCard({ volunteer }: VolunteerCardProps) {
  const { toast } = useToast();

  const handleCall = () => {
    toast({ title: "Calling...", description: `Initiating call with ${volunteer.name} (simulated).` });
  };

  const handleMessage = () => {
    toast({ title: "Messaging...", description: `Opening message with ${volunteer.name} (simulated).` });
  };

  const handleRequestHelp = () => {
    toast({ title: "Help Requested", description: `A help request has been sent to ${volunteer.name} (simulated).` });
  };

  const getStatusIcon = () => {
    switch (volunteer.status) {
      case "Online":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "Offline":
        return <AlertCircle className="h-3 w-3 text-slate-400" />;
      case "Busy":
        return <AlertCircle className="h-3 w-3 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Image
          src={volunteer.avatarUrl}
          alt={`${volunteer.name}'s avatar`}
          width={64}
          height={64}
          className="rounded-full border-2 border-primary"
          data-ai-hint="profile person"
        />
        <div className="flex-grow">
          <CardTitle className="font-headline text-xl flex items-center">
            {volunteer.name}
            {volunteer.isVerified && <ShieldCheck className="ml-2 h-5 w-5 text-green-500" />}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-0.5">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{volunteer.distance} away</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
            {getStatusIcon()}
            <span className="ml-1">{volunteer.status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <Badge variant="secondary" className="text-xs font-normal">{volunteer.responderType}</Badge>
        <p className="text-sm text-foreground">
          <strong>Skills:</strong> {volunteer.skills.join(", ")}
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 bg-muted/50 p-3">
        <Button variant="outline" size="sm" onClick={handleMessage} className="w-full">
          <MessageSquare className="mr-1.5 h-4 w-4" /> Message
        </Button>
        <Button variant="outline" size="sm" onClick={handleCall} className="w-full">
          <Phone className="mr-1.5 h-4 w-4" /> Call
        </Button>
        <Button variant="default" size="sm" onClick={handleRequestHelp} className="w-full bg-primary hover:bg-primary/90">
          <HelpCircleIcon className="mr-1.5 h-4 w-4" /> Request Help
        </Button>
      </CardFooter>
    </Card>
  );
}
