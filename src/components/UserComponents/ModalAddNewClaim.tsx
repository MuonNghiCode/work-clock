import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Space, DatePicker, Select } from "antd";

interface ModalAddNewClaimProps {
  isOpen: boolean;
  onClose: () => void;
}

const fetchUserProject = async (userId: string): Promise<Project | null> => {
  try {
    const response = await axiosInstance.get(``);
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
};

const ModalAddNewClaim: React.FC<ModalAddNewClaimProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [claimRequestData, setClaimRequestData] = useState({
    project_id: "",
    approval_id: "",
    claim_name: "",
    claim_start_date: "",
    claim_end_date: "",
    totalNoOfHours: 0,
    remark: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id") || "";
    console.log("User ID from localStorage:", storedUserId);

    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProject(userId).then((projectData) => {
        setProject(projectData);
        if (projectData) {
          setClaimRequestData((prevData) => ({
            ...prevData,
            project_id: projectData._id,
          }));
        }
      });
      getRoles().then(setRoles);
    }
  }, [isOpen, userId]);

  const handleClaimRequestDataChange = (key: string, value: any) => {
    setClaimRequestData((prevData) => ({ ...prevData, [key]: value }));
  };

  const onFinish = () => {
    console.log("Submitted Data:", claimRequestData);
  };

  return (
    <Modal
      title="Add New Claim Request"
      open={isOpen}
      onOk={onFinish}
      okText="Submit Claim Request"
      onCancel={onClose}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="on"
        size="large"
      >
        {/* Select Project (Không cho chỉnh sửa) */}
        <Form.Item label={<strong>Project Name</strong>} name="project_id">
          <Select
            value={claimRequestData.project_id}
            onChange={(value) =>
              handleClaimRequestDataChange("project_id", value)
            }
            disabled
          >
            {project && (
              <Select.Option key={project._id} value={project._id}>
                {project.name}
              </Select.Option>
            )}
          </Select>
        </Form.Item>

        {/* Select Role as Approval Name */}
        <Form.Item label={<strong>Approval Name</strong>} name="approval_id">
          <Select
            value={claimRequestData.approval_id}
            onChange={(value) =>
              handleClaimRequestDataChange("approval_id", value)
            }
          >
            {roles.map((role) => (
              <Select.Option key={role._id} value={role._id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Time Range */}
        <Space
          direction="horizontal"
          size="large"
          className="!w-full justify-between !flex-wrap"
        >
          <Form.Item label="From" name="claim_start_date">
            <DatePicker
              showTime
              format={"DD-MM-YYYY - HH:mm"}
              onChange={(value) =>
                handleClaimRequestDataChange("claim_start_date", value)
              }
            />
          </Form.Item>
          <Form.Item label="To" name="claim_end_date">
            <DatePicker
              showTime
              format={"DD-MM-YYYY - HH:mm"}
              onChange={(value) =>
                handleClaimRequestDataChange("claim_end_date", value)
              }
            />
          </Form.Item>
          <Form.Item
            label={<strong>Total Working Hours</strong>}
            name="totalNoOfHours"
          >
            <Input
              type="number"
              value={claimRequestData.totalNoOfHours}
              onChange={(e) =>
                handleClaimRequestDataChange(
                  "totalNoOfHours",
                  Number(e.target.value)
                )
              }
            />
          </Form.Item>
        </Space>

        {/* Remarks */}
        <Form.Item label={<strong>Remarks</strong>} name="remark">
          <Input.TextArea
            value={claimRequestData.remark}
            onChange={(e) =>
              handleClaimRequestDataChange("remark", e.target.value)
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddNewClaim;
