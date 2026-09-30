
import AboutSchool from "../../Inc/About/About";
import Activity from "../../Inc/Activity/Activity";
import Gallery from "../../Inc/Gallery/Gallery";
import Header from "../../Inc/Header/Header";
import HeroBanner from "../../Inc/HeroBanner/HeroBanner";
import HowToApply from "../../Inc/HowtoApply/HowToApply";
import Management from "../../Inc/Management/Management";
import Marquee from "../../Inc/Marquee/Marquee";
import NewsEvents from "../../Inc/NewsEvents/NewsEvents";
import ShortContent from "../../Inc/ShortContent/ShortContent";
import StickyHeader from "../../Inc/StickyHeader/StickyHeader";
import WhyChoose from "../../Inc/WhyChoose/WhyChoose";


function Home() {
  return (
      <>
     <div className="relative">

      {/* Sticky Header */}
      <StickyHeader />

      {/* Home Page Content */}
      <main>
        {/* Hero */}
        <section>
          <Header />
          <HeroBanner />
          <Marquee />
          <AboutSchool />
          <Activity />
          <WhyChoose />
          <HowToApply />
          <Gallery />
          <Management />
          <NewsEvents />   
          <ShortContent />
        </section>

        {/* Other sections */}
      </main>

    </div>
    </>
  );
}

export default Home;


