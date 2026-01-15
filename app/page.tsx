import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Crisis } from "@/components/sections/Crisis";
import { Stories } from "@/components/sections/Stories";
import { Mission } from "@/components/sections/Mission";
import { Timeline } from "@/components/sections/Timeline";
import { ProjectLead } from "@/components/sections/ProjectLead";
import { VolunteerForm } from "@/components/sections/VolunteerForm";
import { Hope } from "@/components/sections/Hope";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Partners />
        <Crisis />
        <Stories />
        <Mission />
        <Timeline />
        <ProjectLead />
        <VolunteerForm />
        <Hope />
      </main>
      <Footer />
    </>
  );
}
