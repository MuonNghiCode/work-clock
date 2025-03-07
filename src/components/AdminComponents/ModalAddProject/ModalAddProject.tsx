import { Button, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getUsers } from "../../../services/userAuth";
import { createProject, getAllRoleProject } from "../../../services/projectService";
import { ProjectInfo } from "../../../types/Project";
import { debounce } from "lodash";
import { toast } from "react-toastify";

interface ModalAddProjectProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddProject: React.FC<ModalAddProjectProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [roleList, setRoleList] = useState<{ label: string; value: string }[]>([]);
  const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await getAllRoleProject();
      setRoleList(response.map((item) => ({ label: item.name, value: item.value })));
    };
    fetchRoles();
  }, []);

  const fetchUserList = async (search: string) => {
    if (!search) return;
    setFetching(true);
    const response = await getUsers({ keyword: search, search_by: "username" }, { pageNum: 1, pageSize: 10 });
    setUserOptions(response.data.pageData.map((user: any) => ({
      label: `${user.user_name} | (${user.email})`,
      value: user._id,
    })));
    setFetching(false);
  };

  const debounceFetcher = useMemo(() => debounce(fetchUserList, 300), []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const projectData: ProjectInfo = {
      project_name: values.project_name,
      project_code: values.project_code,
      project_start_date: values.project_start_date ? values.project_start_date.toISOString() : "",
      project_end_date: values.project_end_date ? values.project_end_date.toISOString() : "",
      project_status: '',
      project_department: values.project_department,
      project_description: values.project_description,
      project_members: values.members.map((member: any) => ({
        user_id: member.user_id.value,
        project_role: member.role,
      })),
      updated_by: "",
      is_deleted: false,
    };
    const response = await createProject(projectData);
    if (response.success) {
      toast.success("Project created successfully");
    }
    form.resetFields();
    onClose();
  };

  return (
    <Modal title="Create New Project" open={isOpen} onOk={handleSubmit} onCancel={onClose}>
      <Form form={form} layout="vertical">
        <Form.Item name="project_name" label="Project Name" rules={[{ required: true, message: "Enter project name" }]}>
          <Input placeholder="Enter project name" />
        </Form.Item>
        <Form.Item name="project_code" label="Project Code" rules={[{ required: true, message: "Enter project code" }]}>
          <Input placeholder="Enter project code" />
        </Form.Item>
        <Form.Item name="project_department" label="Department" rules={[{ required: true, message: "Enter department" }]}>
          <Input placeholder="Enter department" />
        </Form.Item>
        <Form.Item name="project_start_date" label="Start Date" >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="project_end_date" label="End Date" >
          <DatePicker />
        </Form.Item>
        <Form.Item name="project_description" label="Description">
          <Input.TextArea placeholder="Enter project description" />
        </Form.Item>
        <Form.List name="members">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="flex gap-2">
                  <Form.Item
                    {...restField}
                    name={[name, "user_id"]}
                    label="Member"
                    rules={[{ required: true, message: "Select a member" }]}
                  >
                    <Select
                      showSearch
                      labelInValue
                      placeholder="Search and select members"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={debounceFetcher}
                      options={userOptions}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "role"]} label="Role" rules={[{ required: true, message: "Select role" }]}>
                    <Select placeholder="Select role" options={roleList} />
                  </Form.Item>
                  <Button type="link" onClick={() => remove(name)}>Remove</Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>Add Member</Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalAddProject;
