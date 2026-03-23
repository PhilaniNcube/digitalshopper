
export default function Team() {
  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-semibold text-center mb-6">Our Team</h2>
      <p className="text-center mx-auto max-w-[600px] px-8">
        Behind Digital shopper is a dedicated team of professionals who are
        passionate about the industry.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center space-y-3">
          <img
            alt="Team member 1"
            className="w-48 h-48 rounded-full object-cover"
            height="200"
            src="/images/nyaks.jpg"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
          <div className="font-semibold text-xl">Nyakallo Khiba</div>
          <div className="text-zinc-500 dark:text-zinc-400">
            Founder and Customer Relations
          </div>
          <p className="text-zinc-600 dark:text-zinc-500 mt-4">
            Hello there! I'm Nyakallo, the driving force behind Digital Shopper.
            With a solid foundation in Economics, a wealth of experience in the
            vibrant world of hospitality, and a business mind that's always
            buzzing, I've curated a space where quality meets convenience. I
            bring a strategic edge to the table. My academic journey has
            equipped me with analytical prowess, and I've translated these
            skills into every aspect of Digital shopper.Running a business isn't
            just a job for me; it's a passion. My business mind is wired for
            efficiency, growth, and delivering exceptional value to you, our
            cherished customer. Every product in our collection is carefully
            selected with your satisfaction in mind.
          </p>
          <p className="text-zinc-600 dark:text-zinc-500 mt-4">
            Having worked in hospitality, I understand the importance of a
            seamless and delightful experience. People aren't just customers;
            they're individuals with unique needs. My experience in
            understanding and connecting with people allows me to curate a
            collection that resonates with your preferences and lifestyle.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <img
            alt="Philani"
            className="w-48 h-48 rounded-full object-cover"
            height="200"
            src="/images/phils.jpg"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
          <div className="font-semibold text-xl">Philani Ncube</div>
          <div className="text-zinc-500 dark:text-zinc-400">
            Web Developer and Digital Marketing Guru
          </div>
          <p className="text-zinc-600 dark:text-zinc-500 mt-4">
            Greetings! I'm Philani Ncube, the tech-savvy force behind the
            scenes, dedicated to bringing our e-commerce platform to life. With
            a passion for clean and functional design, coupled with a deep
            understanding of digital marketing and online advertising, I ensure
            that your online shopping experience is not just seamless but truly
            remarkable.
          </p>
          <p className="text-zinc-600 dark:text-zinc-500 mt-4">
            As a seasoned web developer, I thrive on turning ideas into engaging
            and user-friendly online experiences. But I don't stop at coding.
            With a background in digital marketing, I bring a strategic edge to
            our online presence.
          </p>
          <p className="text-zinc-600 dark:text-zinc-500 mt-4">
            Navigating the ever-evolving landscape of online advertising is my
            playground. I specialize in creating targeted campaigns that not
            only drive traffic but also convert visitors into satisfied
            customers. Your brand's visibility and success are my top
            priorities.Our advertising efforts are not just creative; they're
            backed by data, ensuring maximum impact and ROI.
          </p>
        </div>
      </div>
    </div>
  );
}
