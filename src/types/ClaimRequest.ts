export interface ClaimRequest {
    staffName: string;
    staffDepartment: string;
    staffId: string;
    projectName: string;
    roleInProject: string;
    projectDuration: string;
    claimTable: {
      date: string;
      day: string;
      from: string;
      to: string;
      totalNoOfHours: number;
      remarks: string;
    }[];
    totalWorkingHour: number;
    additionalRemarks: string;
    auditTrail: string;
    dateCreate: string;
    status: "Pending" | "Approval" | "Reject" | "Return" | "Paid";
  amountReceived?: number; // Thêm thuộc tính số tiền nhận được
  }
  
  const generateFakeData = (): ClaimRequest[] => {
    const projects = ["Project A", "Project B", "Project C"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const statuses: ClaimRequest["status"][] = [
      "Pending",
      "Approval",
      "Reject",
      "Return",
      "Paid",
    ];
    const fakeData: ClaimRequest[] = [];
  
    for (let i = 0; i < 20; i++) {
const status = statuses[i % statuses.length];
      fakeData.push({
        staffName: `Staff ${i + 1}`,
        staffDepartment: `Department ${i + 1}`,
        staffId: `ID${i + 1}`,
        projectName: projects[i % projects.length],
        roleInProject: `Role ${i + 1}`,
        projectDuration: `${(i % 12) + 1} months`,
        claimTable: Array.from({ length: 5 }).map((_, j) => ({
          date: `2025-02-${(j % 28) + 1}`,
          day: days[j % days.length],
          from: `2025-02-${(j % 28) + 1}T08:00:00Z`,
          to: `2025-02-${(j % 28) + 1}T16:00:00Z`,
          totalNoOfHours: 3,
          remarks: `Remark ${j + 1}`,
        })),
        totalWorkingHour: 5,
        additionalRemarks: `Additional remarks for staff ${i + 1}`,
        auditTrail: `Audit trail for staff ${i + 1}`,
        dateCreate: `2025-02-${(i % 28) + 1}`,
        status: status,
      amountReceived: status === "Paid" ? (i + 1) * 10 : undefined, // Thêm số tiền nhận được nếu trạng thái là "Paid"
      });
    }
  
    return fakeData;
  };
  
  const fakeData = generateFakeData();
  console.log(fakeData);
  
  export { generateFakeData };
  