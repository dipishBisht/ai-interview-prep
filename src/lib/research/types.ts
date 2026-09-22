
export type ResearchPage = {
  url: string;
  title: string;
  text: string;
  status: number;
  kind: "homepage" | "about" | "hiring" | "interview" | "other";
};

export type ResearchFailure = {
  url: string;
  error: string;
};

export type ResearchResult = {
  companyUrl: string;
  pages: ResearchPage[];
  failures: ResearchFailure[];
  linksDiscovered: number;
  researchedAt: string;
};
