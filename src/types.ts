type Media = string;

export interface Day {
  day: number;
  assets: Media[];
}

export interface Month {
  month: number;
  days: Day[];
}

export interface Year {
  year: number;
  months: Month[];
}

const response: Year[] = [
  {
    year: 2021,
    months: [
      {
        month: 8,
        days: [
          {
            day: 2,
            assets: ["2021/8/2/20210802312373.jpg"],
          },
        ],
      },
    ],
  },
];
