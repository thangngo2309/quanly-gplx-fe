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
  Typography,
} from "@mui/material";

import { memo, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form } from "@/component/form.component";
import { UpdateMultiUserModel } from "@/model/user.model";
import { RecruitmentType, RecruitmentTypeLabel, TeachingSubject, UserPedagogyLevel, UserRole } from "@/enum/user.enum";
import { EditMultiUserDialogProps } from "@/model/user-dialog-props";
import dayjs from "dayjs";
import { emptyToNull } from "@/utils/format-input";
import { USER_NOT_EMPTY_FIELDS } from "@/utils/not-emty-field";
import { DatePickerField } from "../date-picker.component";

export const EditMultiUserDialog = memo(
  ({ open, selectedIds, role, onClose, onSave, }: EditMultiUserDialogProps) => {

    const methods = useForm<UpdateMultiUserModel>({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {},
    });

    const errors = methods.formState.errors;
    const isTeacher = role === UserRole.TEACHER;

    useEffect(() => {
      if (open) { methods.reset(); }
    }, [open]);

    const onSubmit: SubmitHandler<UpdateMultiUserModel> = async (
      data
    ) => {
      USER_NOT_EMPTY_FIELDS.forEach(field => {
        if (data[field] === '' || data[field] == null) {
          delete data[field];
        }
      });

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

              {isTeacher && (
                <>
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
                          slotProps={{
                            select: {
                              displayEmpty: true,
                              renderValue: (value: unknown) => {
                                if (!value) return <Typography>Chọn</Typography>;
                                return <>{RecruitmentTypeLabel[value as RecruitmentType]}</>;
                              },
                            },
                          }}
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
                          placeholder="VD: 12/12, 9/12"
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
                          slotProps={{
                            select: {
                              displayEmpty: true,
                              renderValue: (value: unknown) => {
                                if (!value) return <Typography>Chọn</Typography>;
                                return <>{value as string}</>;
                              },
                            },
                          }}
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
                          slotProps={{
                            select: {
                              displayEmpty: true,
                              renderValue: (value: unknown) => {
                                if (!value) return <Typography>Chọn</Typography>;
                                return <>{value as string}</>;
                              },
                            },
                          }}
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

                  <DatePickerField
                    name="teacher_certificate_issue_date"
                    control={methods.control}
                    label="Ngày cấp chứng chỉ sư phạm"
                    error={!!errors.teacher_certificate_issue_date}
                    helperText={errors.teacher_certificate_issue_date?.message}
                    rules={{
                      validate: {
                        notInFuture: (value: Date) => {
                          if (!value) return true;
                          const d = dayjs(value).startOf('day');
                          const today = dayjs().startOf('day');
                          return d.isBefore(today) || d.isSame(today) || 'Không được là ngày tương lai';
                        }
                      }
                    }}
                  />

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
                          placeholder="VD: Sở Xây dựng Đà Nẵng"
                          fullWidth
                          variant="outlined"
                          error={!!errors.teacher_certificate_issue_place}
                          helperText={errors.teacher_certificate_issue_place?.message}
                        />
                      )}
                    />
                  </FormControl>

                  <DatePickerField
                    name="health_certificate_expiry_date"
                    control={methods.control}
                    label="Ngày hết hạn chứng chỉ sức khỏe"
                    error={!!errors.health_certificate_expiry_date}
                    helperText={errors.health_certificate_expiry_date?.message}
                  />

                  <DatePickerField
                    name="contract_signed_date"
                    control={methods.control}
                    label="Ngày ký hợp đồng"
                    error={!!errors.contract_signed_date}
                    helperText={errors.contract_signed_date?.message}
                    rules={{
                      validate: {
                        notInFuture: (value: Date) => {
                          if (!value) return true;
                          const d = dayjs(value).startOf('day');
                          const today = dayjs().startOf('day');
                          return d.isBefore(today) || d.isSame(today) || 'Không được là ngày tương lai';
                        }
                      }
                    }}
                    triggerOnBlur="contract_expiry_date"
                  />

                  <DatePickerField
                    name="contract_expiry_date"
                    control={methods.control}
                    label="Ngày hết hạn hợp đồng"
                    error={!!errors.contract_expiry_date}
                    helperText={errors.contract_expiry_date?.message}
                    rules={{
                      validate: (value: Date) => {
                        const signed = methods.getValues('contract_signed_date');
                        if (!value || !signed) return true;
                        return dayjs(value).startOf('day').isAfter(dayjs(signed).startOf('day')) || 'Ngày hết hạn phải sau ngày ký hợp đồng';
                      }
                    }}
                    triggerOnBlur="contract_signed_date"
                  />
                </>
              )}

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