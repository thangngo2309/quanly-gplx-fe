'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  TextField,
  DialogActions,
  Button,
  FormLabel,
  MenuItem,
} from "@mui/material";

import { RecruitmentType, RecruitmentTypeLabel, TeachingSubject } from "@/enum/user.enum";
import { UpdateUserModel } from "@/model/user.model";
import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { EditUserDialogProps } from "@/model/user-dialog-props";
import {
  SubmitHandler,
  useForm,
  Controller,
} from "react-hook-form";

export const EditDialog = memo(
  ({ open, onClose, onSave, }: EditUserDialogProps) => {

    const methods = useForm<UpdateUserModel>({
      mode: 'onTouched',
      reValidateMode: 'onChange',
    });

    const errors = methods.formState.errors;

    useEffect(() => {
      if (open) { methods.reset(); }
    }, [open]);

    const onSubmit: SubmitHandler<UpdateUserModel> = async (data) => { onSave(data); };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        keepMounted
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>

        {open && (
          <Form<UpdateUserModel>
            onSubmit={onSubmit}
            methods={methods}
          >
            <DialogContent>

              <FormControl fullWidth margin="dense">
                <FormLabel>Họ và tên</FormLabel>
                <Controller
                  name="fullname"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                      error={!!errors.fullname}
                      helperText={
                        errors.fullname?.message
                      }
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Ngày sinh</FormLabel>
                <Controller
                  name="date_of_birth"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      type="date"
                      fullWidth
                      variant="outlined"
                      error={!!errors.date_of_birth}
                      helperText={errors.date_of_birth?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>CCCD</FormLabel>
                <Controller
                  name="citizen_id"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                      error={!!errors.citizen_id}
                      helperText={
                        errors.citizen_id?.message
                      }
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Địa chỉ</FormLabel>
                <Controller
                  name="address"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                      error={!!errors.address}
                      helperText={
                        errors.address?.message
                      }
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Loại hợp đồng
                </FormLabel>
                <Controller
                  name="recruitment_type"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      select
                      fullWidth
                      variant="outlined"
                    >
                      {Object.values(
                        RecruitmentType
                      ).map((RecruitmentType) => (
                        <MenuItem
                          key={RecruitmentType}
                          value={RecruitmentType}
                        >
                          {RecruitmentTypeLabel[RecruitmentType] ?? RecruitmentType}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Trình độ học vấn
                </FormLabel>
                <Controller
                  name="education_level"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Trình độ chuyên môn
                </FormLabel>
                <Controller
                  name="professional_level"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Trình độ sư phạm
                </FormLabel>
                <Controller
                  name="pedagogy_level"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Môn học</FormLabel>
                <Controller
                  name="teaching_subject"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      select
                      fullWidth
                      variant="outlined"
                    >
                      {Object.values(
                        TeachingSubject
                      ).map((subject) => (
                        <MenuItem
                          key={subject}
                          value={subject}
                        >
                          {subject}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Số chứng chỉ giáo viên
                </FormLabel>
                <Controller
                  name="teacher_certificate_number"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Ngày cấp chứng chỉ
                </FormLabel>
                <Controller
                  name="teacher_certificate_issue_date"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      type="date"
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Nơi cấp chứng chỉ
                </FormLabel>
                <Controller
                  name="teacher_certificate_issue_place"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Số chứng chỉ sức khỏe
                </FormLabel>
                <Controller
                  name="health_certificate_number"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Ngày hết hạn chứng chỉ sức khỏe
                </FormLabel>
                <Controller
                  name="health_certificate_expiry_date"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      type="date"
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Số hợp đồng
                </FormLabel>
                <Controller
                  name="contract_number"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Ngày ký hợp đồng
                </FormLabel>
                <Controller
                  name="contract_signed_date"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      type="date"
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>
                  Ngày hết hạn hợp đồng
                </FormLabel>
                <Controller
                  name="contract_expiry_date"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      type="date"
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </FormControl>

            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>
                Hủy
              </Button>

              <Button
                type="submit"
                variant="contained"
              >
                Lưu
              </Button>
            </DialogActions>
          </Form>
        )}
      </Dialog>
    );
  }
);