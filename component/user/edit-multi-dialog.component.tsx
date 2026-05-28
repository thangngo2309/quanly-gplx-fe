'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  Checkbox,
} from "@mui/material";

import { memo, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form } from "@/component/form.component";
import { UpdateMultiUserModel } from "@/model/user.model";
import { RecruitmentType, TeachingSubject } from "@/enum/user.enum";
import { EditMultiUserDialogProps } from "@/model/user-dialog-props";

export const EditMultiUserDialog = memo(
  ({open, selectedIds, onClose, onSave,}: EditMultiUserDialogProps) => {

    const methods = useForm<UpdateMultiUserModel>({
      mode: "onTouched",
      reValidateMode: "onChange",
      defaultValues: {},
    });

    const errors = methods.formState.errors;

    useEffect(() => {
      if (open) { methods.reset();}
    }, [open]);

    useEffect(() => {
      if (!open) return;
      methods.reset({});
    }, [open]);

    const onSubmit: SubmitHandler<UpdateMultiUserModel> = async (
      data
    ) => {onSave(selectedIds, data);};

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          Chỉnh sửa nhiều người dùng
        </DialogTitle>

        {open && (
          <Form<UpdateMultiUserModel>
            onSubmit={onSubmit}
            methods={methods}
          >
            <DialogContent>

              <FormControl fullWidth margin="dense">
                <FormLabel>Tên</FormLabel>

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

              <Controller
                name="is_active"
                control={methods.control}
                render={({ field }) => (
                  <FormControlLabel
                    label="Kích hoạt"
                    control={
                      <Checkbox
                        checked={!!field.value}
                        onChange={(e) =>
                          field.onChange(e.target.checked)
                        }
                        color="primary"
                      />
                    }
                  />
                )}
              />

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
                      ).map((type) => (
                        <MenuItem
                          key={type}
                          value={type}
                        >
                          {type}
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
                disabled={selectedIds.length === 0}
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

EditMultiUserDialog.displayName =
  "EditMultiUserDialog";