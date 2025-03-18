import { Button, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getUsers } from "../../../services/userAuth";
import {
  createProject,
  getEditProject,
  getAllRoleProject,
  getProjectById,
} from "../../../services/projectService";
import { ProjectInfo } from "../../../types/Project";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import dayjs from "dayjs";

interface ModalAddProjectProps {
  isOpen: {
    isOpen: boolean;
    formStatus: "add" | "edit" | undefined;
  };
  onClose: () => void;
  project?: ProjectInfo | null;
}

const ModalAddProject: React.FC<ModalAddProjectProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [form] = Form.useForm();
  const [roleList, setRoleList] = useState<{ label: string; value: string }[]>(
    []
  );
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [formCheck, setFormCheck] = useState<"add" | "edit" | undefined>(
    isOpen.formStatus
  );

  const fetchRoles = async () => {
    const response = await getAllRoleProject();
    setRoleList(
      response.map((item) => ({ label: item.name, value: item.value }))
    );
  };

  const loadEditProject = async () => {
    fetchRoles();
    if (project?._id) {
      setFormCheck("edit");
      const response = await getProjectById(project._id);
      await form.setFieldsValue({
        project_name: response.data.project_name,
        project_code: response.data.project_code,
        project_department: response.data.project_department,
        project_status: response.data.project_status,
        project_start_date: response.data.project_start_date
          ? dayjs(response.data.project_start_date)
          : null,
        project_end_date: response.data.project_end_date
          ? dayjs(response.data.project_end_date)
          : null,
        project_description: response.data.project_description,
        project_members: response.data.project_members.map((member) => ({
          user_id: { label: member.user_name, value: member.user_id },
          role: member.project_role,
        })),
      });
    } else {
      setFormCheck("add");
      // console.log("no project data...");
      form.resetFields();
    }
  };

  useEffect(() => {
    if (isOpen.isOpen) {
      loadEditProject();
    }
  }, [isOpen.isOpen, project]);

  useEffect(() => {
    if (form) {
      loadEditProject();
    }
  }, [form, project]);

  const fetchUserList = async (search: string) => {
    if (!search) return;
    setFetching(true);
    const response = await getUsers(
      { keyword: search, search_by: "username" },
      { pageNum: 1, pageSize: 10 }
    );
    setUserOptions(
      response.data.pageData.map((user: any) => ({
        label: `${user.user_name} | (${user.email})`,
        value: user._id,
      }))
    );
    setFetching(false);
  };

  const debounceFetcher = useMemo(() => debounce(fetchUserList, 300), []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const newProjectData: ProjectInfo = {
      project_name: values.project_name,
      project_code: values.project_code,
      project_start_date: values.project_start_date
        ? values.project_start_date.toISOString()
        : "",
      project_end_date: values.project_end_date
        ? values.project_end_date.toISOString()
        : "",
      project_status: values.project_status ? values.project_status : "",
      project_department: values.project_department,
      project_description: values.project_description,
      project_members: (values.project_members || []).map((member: any) => ({
        user_id: member.user_id.value,
        project_role: member.role,
      })),
      updated_by: "", // Assuming this should be a string, but consider fetching the actual user ID if available
      is_deleted: false,
      _id: project?._id || undefined, // Use optional chaining and provide undefined instead of null
    };
    // console.log("check submit", newProjectData);
    const response = newProjectData._id
      ? await getEditProject(newProjectData, newProjectData._id)
      : await createProject(newProjectData);
    if (response.success) {
      toast.success(
        `Project ${newProjectData._id ? "updated" : "created"} successfully`
      );
    }
    form.resetFields();
    onClose();
  };

  const handleClose = () => {
    form.resetFields();
    if (formCheck === "edit") setFormCheck(undefined);
    onClose();
  };
  const optionStatus = ["New", "Processing", "Pending", "Complete"];

  return (
    <Modal
    title={
      <span className={formCheck === "add" ? "text-gradient-color" : "text-gradient-color"}>
        {formCheck === "add" ? "Create New Project" : "Edit Project"}
      </span>
    }
      open={isOpen.isOpen}
      onOk={handleSubmit}
      onCancel={handleClose}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="project_name"
            label="Project Name"
            rules={[{ required: true, message: "Enter project name" }]}
            className="w-full"
          >
            <Input placeholder="Enter project name" />
          </Form.Item>
          <Form.Item
            name="project_code"
            label="Project Code"
            rules={[{ required: true, message: "Enter project code" }]}
            className="w-full"
          >
            <Input placeholder="Enter project code" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="project_department"
            label="Department"
            rules={[{ required: true, message: "Enter department" }]}
            className="w-full"
          >
            <Input placeholder="Enter department" />
          </Form.Item>
          {formCheck === "edit" && (
            <Form.Item name="project_status" label="Status" className="w-full">
              <Select
                options={optionStatus.map(status => ({ label: status, value: status }))}
                placeholder="Select Status"
              />
            </Form.Item>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="project_start_date" label="Start Date" className="w-full">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="project_end_date" label="End Date" className="w-full">
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        <Form.Item name="project_description" label="Description">
          <Input.TextArea placeholder="Enter project description" />
        </Form.Item>

        <Form.List name="project_members">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="flex gap-2 items-center">
                  <Form.Item
                    {...restField}
                    name={[name, "user_id"]}
                    label="Member"
                    rules={[{ required: true, message: "Select a member" }]}
                    className="w-full"
                  >
                    <Select
                      showSearch
                      labelInValue
                      placeholder="Search and select members"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={debounceFetcher}
                      options={userOptions}
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "role"]}
                    label="Role"
                    rules={[{ required: true, message: "Select role" }]}
                    className="w-full"
                  >
                    <Select placeholder="Select role" options={roleList} />
                  </Form.Item>
                  <Button type="link" danger onClick={() => remove(name)}>Remove</Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Member
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalAddProject;
