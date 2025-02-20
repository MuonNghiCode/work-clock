export interface ClaimTableItem {
  date: Date;
  day: string;
  from: string;
  to: string;
  totalNoOfHours: number;
  remarks: string;
}export interface ClaimRequest {
  amountReceived?: number;
  staffName: string;
  staffRole: string;
  staffId: string;
  projectName: string;
  roleInProject: string;
  projectDuration: string;
  totalWorkingHour: number;
  additionalRemarks: string;
  auditTrail: string;
  dateCreate: Date; // New field for date create
  status: "Pending" | "Approve" | "Reject" | "Return";
  claimTable: ClaimTableItem[];
}

const generateFakeData = (): ClaimRequest[] => {
  const projects = ["Project A", "Project B", "Project C"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const statuses: ClaimRequest["status"][] = [
    "Pending",
    "Approve",
    "Reject",
    "Return",
  ];
  const fakeData: ClaimRequest[] = [];

  for (let i = 0; i < 1000; i++) {
    fakeData.push({
      staffName: `Staff ${i + 1}`,
      staffRole: `Department ${i + 1}`,
      staffId: `ID${i + 1}`,
      projectName: projects[i % projects.length],
      roleInProject: `Role ${i + 1}`,
      projectDuration: `${(i % 12) + 1} months`,
      claimTable: Array.from({ length: 5 }).map((_, j) => ({
        date: new Date(`2025-${(j % 28)} - ${(j % 28) + 1}`),
        day: days[j % days.length],
        from: `2025-02 - ${(j % 28) + 1}T08:00:00Z`,
        to: `2025-02 - ${(j % 28) + 1} T16:00:00Z`,
        totalNoOfHours: fakeData.length + j,
        remarks: `Remark ${j + 1} `,
      })),
      totalWorkingHour: fakeData.length,
      additionalRemarks: `Additional remarks for staff ${i + 1}`,
      auditTrail: `Audit trail for staff ${i + 1}`,
      dateCreate: new Date(`2025-02-${String((i % 28) + 1).padStart(2, '0')}`),
      status: statuses[i % statuses.length],
    });
  }

  return fakeData;
};

const fakeData = generateFakeData();
console.log(fakeData);

export { generateFakeData };
