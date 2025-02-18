import { ClaimRequest, generateFakeData } from "../../types/ClaimRequest";
import TableUserDashboard from "./TableUserDashboard";

function UserDashboard() {
  const data: ClaimRequest[] = generateFakeData();
  return (
    <div>
      <div className="w-full flex justify-center">
        <div className="flex flex-col w-11/12">
          <h1 className="text-5xl !py-9">Dashboard</h1>
          <TableUserDashboard data={data} />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
