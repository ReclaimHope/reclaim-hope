import ChildCard from "./ChildCard";
export interface Child {
  id: string;
  name: string;
  age: number;
  dream: string;
  image: string;
  summary: string;
  story: string[];

  support?: string;
  goals?: string[];
  needs?: string[];
  updates?: string[];
  sponsorshipImpact?: string;
}

export const children: Child[] = [
  {
    id: "Matambi",
    name: "Matambi",
    age: 17,
    dream: "makeup artist",
    support: "education and school materials",
    image: "/Matambi.png",
    summary:
      "Shakira is the youngest of three children and lives with her mother, who works as a security guard to support the family.",
    story: [
      "Shakira is the youngest of three children and lives with her mother, who works as a security guard to provide for the family. A Senior 4 student at Sainte Marie Reine, Shakira has a real flair for beauty and salon arts, and dreams of training as a professional makeup artist. With your sponsorship, Shakira receives school fees and supplies, health insurance, nutritious meals, and ongoing mentorship — the support she needs to turn her talent into a thriving career."
    ],
    goals: [
      "Complete primary education",
      "Excel in science subjects",
      "Become a healthcare professional"
    ],
    needs: [
      "School supplies",
      "Tuition support",
      "Nutritious meals",
      "Mentorship"
    ],
    updates: [
      "Promoted to next class",
      "Joined leadership activities",
      "Improved school attendance"
    ],
    sponsorshipImpact:
      "Your sponsorship helps provide education, nutrition, mentorship, and opportunities for long-term growth."
  },
  // {
  //   id: "Salim",
  //   name: "Salim Cyizere",
  //   Age: 18,
  //   dream: "Chef",
  //   image: "/Salim.jpg",
  //   summary: "Salim is the eldest of five children. He lost his mother four years ago and now lives with his father and grandparents, who support the family through part-time work.",
  //   story: [
  //     "Salim is the eldest of five children. He lost his mother four years ago and now lives with his father and grandparents, who do their best on part-time work to keep the family going. At GS Cyahafi, Salim is training in Food & Beverage Operations, working toward his dream of becoming a professional chef — and when he's not in the kitchen, you'll find him on the football field, doing what he loves most. Sponsorship gives Salim school fees and supplies, health insurance, nutritious meals, and mentorship to help him reach his goal."
  //   ],


  // },
  {
    id: "Aliane",
    name: "Aliane Cyuzuzo",
    age: 18,
    dream: "business woman",
    image: "/Aliane.png",
    summary: "Aliane lives with her father and stepmother in a household of seven children, supported by her father's part-time work.",
    story: [
      "Aliane lives with her father and stepmother in a busy household of seven children, supported by her father's part-time work. She's a Senior 5 student in the MCE combination at ES Rugabano, with a clear ambition to become a successful businesswoman one day. Music is her joy — she loves to sing and is rarely without a song playing nearby. Through sponsorship, Aliane receives school fees and supplies, health insurance, nutritious meals, and mentorship to help her build the future she's working toward."
    ]
  },
  {
    id: "Louange",
    name: "Louange Igihozo",
    age: 11,
    dream: "Soldier",
    image: "/Louange.png",
    summary: "Louange is the youngest of three children and lives with both of her parents.",
    story: [
      "Louange is the youngest of three children and lives with both of her parents. She's in Primary 6 at EP Ntwali, working hard to prepare for her national examination this year. Outside the classroom, she loves art and craft, and she's set her sights on a bold dream — becoming a soldier when she grows up. Sponsorship supports Louange with school fees and supplies, health insurance, nutritious meals, and mentorship as she works toward this important exam and beyond."
    ]
  },
  {
    id: "Chancerine",
    name: "Chancerine Izuwayo",
    age: 16,
    dream: "Company manager",
    image: "/Chanceline.png",
    summary: "Chanceline is the youngest of five children and lives with her mother, who works on other people's farms to provide for the family.",
    story: [
      "Chanceline is the youngest of five children and lives with her mother, who works on other people's farms to provide for the family. She's in Primary 5 at GS Cyivugiza and has a gift for art and craft, especially weaving. Chanceline dreams big — she wants to become a company manager when she grows up. Sponsorship provides Chanceline with school fees and supplies, health insurance, nutritious meals, and mentorship to help her build the skills she'll need to lead."
    ]
  },
  {
    id: "Radju",
    name: "Radju Foranny Kwizera",
    age: 15,
    dream: "Football/soccer player",
    image: "/Raju.png",
    summary: "Radju is one of five children. He lost his mother four years ago and now lives with his father and grandmother, who works part-time jobs to keep the family afloat.",
    story: [
      "Radju is one of five children. He lost his mother four years ago and now lives with his father and grandmother, who works part-time jobs to keep the family afloat. He's in Primary 6 at GS Cyivugiza, preparing for his national examination, and his favorite way to unwind is on the football pitch — he dreams of becoming a professional football player. Sponsorship supports Radju with school fees and supplies, health insurance, nutritious meals, and mentorship through this important exam year."
    ]
  },
  {
    id: "Raoul",
    name: "Raoul Mugisha",
    age: 18,
    dream: "Electrical engineer",
    image: "/Raoul.png",
    summary: "Raoul is one of seven children and lives with both of his parents, with his father taking on part-time work to support the family.",
    story: [
      "Raoul is one of seven children and lives with both of his parents, with his father taking on part-time work to support the family. He's in Level 3, studying Electrical Technology at GS Akumunigo TSS, and is determined to become an electrical engineer. Music runs through him too — he loves playing the drums in his free time. Sponsorship helps Raoul with school fees and supplies, health insurance, nutritious meals, and mentorship as he trains for his future career."
    ]
  },
  {
    id: "Beline",
    name: "Beline Niyonkuru",
    age: 18,
    dream: "Bank Manager",
    image: "/Beline.png",
    summary: "Beline is the youngest of four children and lives with both of her parents, who work part-time jobs to support the family.",
    story: [
      "Beline is the youngest of four children and lives with both of her parents, who work part-time jobs to support the family. She's a Senior 5 student in the Math-Economics-Geography (MEG) combination at Sainte Marie Reine, with her sights set on a career as a bank manager. Outside her studies, Beline loves traditional dance and the culture behind it. Sponsorship gives Beline school fees and supplies, health insurance, nutritious meals, and mentorship as she works toward a future in finance."
    ]
  },
  {
    id: "Yvan",
    name: "Yvan Rucogoza",
    age: 18,
    dream: "Traditional dancer",
    image: "/Yvan.png",
    summary: "Yvan lives with both of his parents in a family of seven children. His father works as a security guard at a bank.",
    story: [
      "Yvan lives with both of his parents in a family of seven children. His father works as a security guard at a bank to provide for everyone. At Auto Ecole Ste Famille VTC, Yvan is training in Level 3 Mechanics, building practical skills for his future career. He's also a gifted traditional dancer and lights up whenever there's a chance to perform. Sponsorship supports Yvan with school fees, school supplies, health insurance, nutritious meals, and mentorship as he completes his technical training."
    ]

  },
  {
    id: "Cezar",
    name: "Kenny Cezar Uwiragiye",
    age: 13,
    dream: "Judge",
    image: "/Cesar.png",
    summary: "Kenny Cezar lives with his mother in a family of seven children.",
    story: [
      "Kenny Cezar lives with his mother in a family of seven children. He's in Primary 6 at GS Cyivugiza, preparing for his national examination, and has set his heart on becoming a judge one day. Traditional dance is his favorite way to spend free time, and he rarely misses a chance to perform. Sponsorship gives Kenny Cezar school fees, school supplies, health insurance, nutritious meals, and mentorship through this critical exam year."
    ]
  },
  {
    id: "Assouman",
    name: "Assouman Tugerageze",
    age: 15,
    dream: "Football/soccer player",
    image: "/Assouman.png",
    summary: "Assouman lives with both of his parents in a family of five children. His mother works as a cook at the Reclaim Hope Rwanda Center.",
    story:
      [
        "Assouman lives with both of his parents in a family of five children. His mother works as a cook at the Reclaim Hope Rwanda Center. He's in Primary 5 at GS Cyivugiza and is an active member of his school's football club, where his passion for the game truly shows. Assouman dreams of becoming a professional football player. Sponsorship provides Assouman with school fees, school supplies, health insurance, nutritious meals, and mentorship to help him chase that dream."
      ]
  },
  {
    id: "Chance",
    name: "Chance Umuhire",
    age: 17,
    dream: "Hotel Manager",
    image: "/Chance.png",
    summary: "Chance is the eldest of three children and lives with her mother, who takes on part-time work to support the family.",
    story: [
      "Chance is the eldest of three children and lives with her mother, who takes on part-time work to support the family. She's a Senior 5 student in the Languages (LFK) combination at GS Shyogwe, with a warm, people-first personality that shows in everything she does — she loves building good relationships with others. Chance dreams of becoming a hotel manager. Sponsorship gives Chance school fees, school supplies, health insurance, nutritious meals, and mentorship as she finishes secondary school."
    ]
  },
  {
    id: "Samuel",
    name: "Samuel Umurerwa",
    age: 16,
    dream: "Software Developer",
    image: "/Samuel.png",
    summary: "Samuel lives with both of his parents, who do part-time work to support the family. He and his two siblings have faced real loss together as a family, but have remained close.",
    story:[
      "Samuel lives with both of his parents, who do part-time work to support the family. He and his two siblings have faced real loss together, but they've remained close. Samuel is in Senior 3 at GS Cyivugiza, preparing for his national examination, with a clear goal in mind — he wants to become a software developer. Sponsorship gives Samuel school fees, school supplies, health insurance, nutritious meals, and mentorship as he works toward that goal."
    ]

  },
  {
    id: "Sharapova",
    name: "Sharapova Umwari",
    age: 10,
    dream: "Pilot",
    image: "/Sharapova.png",
    summary: "Sharapova is the youngest of five children. She lost her mother four years ago and now lives with her father and grandmother, supported by her father's part-time work.",
    story: [
      "Sharapova is the youngest of five children. She lost her mother four years ago and now lives with her father and grandmother, supported by her father's part-time work. She's in Primary 3 at EP Gitega, and dance is where she truly shines — modern dance is her favorite. Sharapova has a big dream: she wants to become a pilot. Sponsorship gives Sharapova school fees, school supplies, health insurance, nutritious meals, and mentorship as she pursues that dream."
    ]
  },
  {
    id: "Betty",
    name: "Betty Usanase",
    age: 16,
    dream: "Makeup artist",
    image: "/Betty.png",
    summary: "Betty is the youngest of four children and lives with both of her parents, who do part-time work to provide for the family.",
    story: [
      "Betty is the youngest of four children and lives with both of her parents, who do part-time work to provide for the family. She's a Senior 4 student in the MS2 combination at Ecole Sainte Bernadette, and her passion lies in beauty — she loves doing makeup for others and dreams of becoming a professional makeup artist. Sponsorship gives Betty school fees, school supplies, health insurance, nutritious meals, and mentorship as she builds toward that career."
    ]
  },
  {
    id: "Ornella",
    name: "Ornella Usanase",
    age: 9,
    dream: "Soldier",
    image: "/Ornella.png",
    summary: "Ornella lives with both of her parents in a family of seven children, supported by her parents' part-time work.",
    story: [
      "Ornella lives with both of her parents in a family of seven children, supported by her parents' part-time work. She's in Primary 4 at GS Cyivugiza, and loves nothing more than playing with her friends after school. Ornella has a bold ambition — she wants to become a soldier when she grows up. Sponsorship gives Ornella school fees, school supplies, health insurance, nutritious meals, and mentorship to support her along the way."
    ]
  },
  {
    id: "Kennedy",
    name: "Ganza Kennedy Uwimana",
    image: "/Kennedy.png",
    age: 8,
    dream: "Soldier",
    summary: "Ganza is the eldest of two children and lives with both of his parents. His mother works as a cleaner at the Reclaim Hope Rwanda Center.",
    story: [
      "Ganza is the eldest of two children and lives with both of his parents. His mother works as a cleaner at the Reclaim Hope Rwanda Center. He's in Primary 3 at GS Cyivugiza, and football is his favorite pastime. Ganza dreams of becoming a soldier when he grows up. Sponsorship gives Ganza school fees, school supplies, health insurance, nutritious meals, and mentorship to support his education."
    ]
  },
  {
    id: "Innocent",
    name: "Innocent Uwimana",
    age: 18,
    dream: "Football/soccer player",
    image: "/Innocent.png",
    summary: "Innocent is one of six children. Both of his parents have passed away, and he is now cared for by a guardian.",
    story: [
      "Innocent is one of six children. Both of his parents have passed away, and he is now cared for by a guardian. He is training in Level 3 Mechanics at Auto Ecole Ste Famille VTC, building hands-on skills for his future, and football is where he loves to spend his free time. Sponsorship gives Innocent school fees, school supplies, health insurance, nutritious meals, and mentorship as he completes his training."
    ]
  },
  {
    id: "Baptiste",
    name: "Jean Baptiste Uwituze",
    age: 13,
    dream: "Football/soccer player",
    image: "/Baptise.png",
    summary: "Jean Baptiste lives with both of his parents in a family of three children, supported by his parents' part-time work.",
    story: [
      "Jean Baptiste lives with both of his parents in a family of three children, supported by his parents' part-time work. He's in Senior 1 at GS Cyivugiza, and football is at the center of his world — he dreams of becoming a professional football player. Sponsorship gives Jean Baptiste school fees, school supplies, health insurance, nutritious meals, and mentorship as he begins secondary school."
    ]
  },
  {
    id: "Munezero",
    name: "Fabienne Munezero",
    age: 8,
    dream: "Teacher",
    image: "/Munezero.png",
    summary: "Fabienne is the youngest of five children and lives with both of her parents. Her mother works as a cook at the Reclaim Hope Rwanda Center.",
    story: [
      "Fabienne is the youngest of five children and lives with both of her parents. Her mother works as a cook at the Reclaim Hope Rwanda Center. A Primary 4 student at EP Ntwali, Fabienne lights up whenever modern dance music comes on — it's her favorite way to express herself. She dreams of becoming a teacher when she grows up. Sponsorship provides Fabienne with school fees and supplies, health insurance, nutritious meals, and mentorship to support her education."
    ]
  }

];

type ChildGridProps = {
  onChildSelect?: (id: string) => void;
  activeChildId?: string;
};

export default function ChildGrid({
  onChildSelect,
  activeChildId,
}: ChildGridProps) {
  return (
    <section id="" className="w-full bg-[#f9fafb] py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[#f9d20a] uppercase tracking-[0.3em] font-semibold mb-4">
            Meet the Children
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              id={child.id}
              name={child.name}
              age={child.age}
              image={child.image}
              active={activeChildId === child.id}
              onSelect={onChildSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
