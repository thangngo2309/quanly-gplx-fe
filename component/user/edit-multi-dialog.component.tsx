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
import { RecruitmentType, RecruitmentTypeLabel, TeachingSubject, UserPedagogyLevel } from "@/enum/user.enum";
import { EditMultiUserDialogProps } from "@/model/user-dialog-props";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { emptyToNull } from "@/utils/format-input";

export const EditMultiUserDialog = memo(
  ({ open, selectedIds, onClose, onSave, }: EditMultiUserDialogProps) => {

    const methods = useForm<UpdateMultiUserModel>({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {},
    });

    const errors = methods.formState.errors;

    useEffect(() => {
      if (open) { methods.reset(); }
    }, [open]);

    const onSubmit: SubmitHandler<UpdateMultiUserModel> = async (
      data
    ) => {
      onSave(selectedIds, {
        ...data,
        recruitment_type: emptyToNull(data.recruitment_type),
        pedagogy_level: emptyToNull(data.pedagogy_level),
        teaching_subject: emptyToNull(data.teaching_subject),
      });
    };

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
                <FormLabel>Họ và tên</FormLabel>
                <Controller
                  name="fullname"
                  control={methods.control}
                  rules={{
                    pattern: {
                      value: /^[^\s]+(\s[^\s]+)+$/,
                      message: 'Họ và tên phải bao gồm ít nhất hai từ và không chứa khoảng trắng ở đầu hoặc cuối'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      fullWidth
                      variant="outlined"
                      error={!!errors.fullname}
                      helperText={errors.fullname?.message}
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
                      placeholder="Ví dụ: Xóm A, Xã B, Tỉnh C"
                      fullWidth
                      variant="outlined"
                      error={!!errors.address}
                      helperText={errors.address?.message}
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
                      <MenuItem value="">-- Trống --</MenuItem>
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
                <FormLabel>Trình độ học vấn</FormLabel>
                <Controller
                  name="education_level"
                  control={methods.control}
                  rules={{
                    pattern: {
                      value: /^(?:[1-9]|1[0-2])\/12$/,
                      message: 'Trình độ học vấn phải có định dạng "x/12"',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Ví dụ: 12/12"
                      fullWidth
                      variant="outlined"
                      error={!!errors.education_level}
                      helperText={errors.education_level?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Trình độ chuyên môn</FormLabel>
                <Controller
                  name="professional_level"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      placeholder="Ví dụ: Đại học, Cao đẳng + Chuyên ngành"
                      variant="outlined"
                      error={!!errors.professional_level}
                      helperText={errors.professional_level?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Trình độ sư phạm</FormLabel>
                <Controller
                  name="pedagogy_level"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      select
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value="">-- Trống --</MenuItem>
                      {Object.values(UserPedagogyLevel).map((l) => (
                        <MenuItem key={l} value={l}>{l}</MenuItem>
                      ))}
                    </TextField>
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
                      <MenuItem value="">-- Trống --</MenuItem>
                      {Object.values(
                        TeachingSubject
                      ).map((subject) => (
                        <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Ngày cấp chứng chỉ</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="teacher_certificate_issue_date"
                    control={methods.control}
                    rules={{
                      validate: {
                        notInFuture: (value) => {
                          if (!value) return true;
                          const d = dayjs(value).startOf('day');
                          const today = dayjs().startOf('day');
                          return d.isBefore(today) || d.isSame(today) || 'Không được là ngày tương lai';
                        }
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
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
                      placeholder="Ví dụ: Sở Giáo dục và Đào tạo TP.HCM"
                      fullWidth
                      variant="outlined"
                      error={!!errors.teacher_certificate_issue_place}
                      helperText={errors.teacher_certificate_issue_place?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Ngày hết hạn chứng chỉ sức khỏe</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="health_certificate_expiry_date"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Ngày ký hợp đồng</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="contract_signed_date"
                    control={methods.control}
                    rules={{
                      validate: {
                        notInFuture: (value) => {
                          if (!value) return true;
                          const d = dayjs(value).startOf('day');
                          const today = dayjs().startOf('day');
                          return d.isBefore(today) || d.isSame(today) || 'Không được là ngày tương lai';
                        }
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date);
                          methods.trigger('contract_expiry_date');
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Ngày hết hạn hợp đồng</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="contract_expiry_date"
                    control={methods.control}
                    rules={{
                      validate: (value) => {
                        const signed = methods.getValues('contract_signed_date');
                        if (!value || !signed) return true;
                        return dayjs(value).startOf('day').isAfter(dayjs(signed).startOf('day')) || 'Ngày hết hạn phải sau ngày ký hợp đồng';
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
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