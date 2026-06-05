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
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import { RecruitmentType, RecruitmentTypeLabel, TeachingSubject, UserPedagogyLevel } from "@/enum/user.enum";
import { UpdateUserModel } from "@/model/user.model";
import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { EditUserDialogProps } from "@/model/user-dialog-props";
import {
  SubmitHandler,
  useForm,
  Controller,
} from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { debouncedUniqueCitizenId, debouncedUniqueTeacherCert, debouncedUniqueHealthCert, debouncedUniqueContract } from "@/utils/debounced-user";
import { emptyToNull } from "@/utils/format-input";

export const EditDialog = memo(
  ({ open, onClose, onSave, data }: EditUserDialogProps) => {

    const methods = useForm<UpdateUserModel>({
      mode: 'onChange',
      reValidateMode: 'onChange',
    });

    const errors = methods.formState.errors;

    useEffect(() => {
      if (open && data) {
        methods.reset(data);
      }
    }, [open, data]);

    const onSubmit: SubmitHandler<UpdateUserModel> = async (data) => {
      const { user_id, ...updatePayload } = data;
      onSave({
        ...updatePayload,
        recruitment_type: emptyToNull(updatePayload.recruitment_type),
        pedagogy_level: emptyToNull(updatePayload.pedagogy_level),
        teaching_subject: emptyToNull(updatePayload.teaching_subject),
      });
    };

    const checkCitizenId = async (value: string | undefined) => {
      if (!value) return true;
      const res = await debouncedUniqueCitizenId(value, Number(data.user_id));
      return res || 'Số CCCD đã tồn tại';
    };

    const checkTeacherCertificateNumber = async (value: string | undefined) => {
      if (!value) return true;
      const res = await debouncedUniqueTeacherCert(value, Number(data.user_id));
      return res || 'Số chứng chỉ giáo viên đã tồn tại';
    };

    const checkHealthCertificateNumber = async (value: string | undefined) => {
      if (!value) return true;
      const res = await debouncedUniqueHealthCert(value, Number(data.user_id));
      return res || 'Số chứng chỉ sức khỏe đã tồn tại';
    };

    const checkContractNumber = async (value: string | undefined) => {
      if (!value) return true;
      const res = await debouncedUniqueContract(value, Number(data.user_id));
      return res || 'Số hợp đồng đã tồn tại';
    };

    return (
      <Dialog open={open} onClose={onClose} keepMounted maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>

        {open && (
          <Form<UpdateUserModel> onSubmit={onSubmit} methods={methods}>
            <DialogContent>

              <FormControl fullWidth margin="dense">
                <FormLabel required>Họ và tên</FormLabel>
                <Controller
                  name="fullname"
                  control={methods.control}
                  rules={{
                    required: 'Họ và tên là bắt buộc',
                    pattern: {
                      value: /^[^\s]+(\s[^\s]+)+$/,
                      message: 'Họ và tên phải bao gồm ít nhất hai từ và không chứa khoảng trắng ở đầu hoặc cuối'
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                      error={!!errors.fullname}
                      helperText={errors.fullname?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel required>Ngày sinh</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="date_of_birth"
                    control={methods.control}
                    rules={{
                      required: 'Ngày sinh là bắt buộc',
                      validate: {
                        minAge: (value) => {
                          if (!value) return true;
                          const d = dayjs(value).startOf('day');
                          const today = dayjs().startOf('day');
                          return today.diff(d, 'year') >= 18 || 'Người dùng phải từ 18 tuổi trở lên';
                        }
                      }
                    }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            error: !!errors.date_of_birth,
                            helperText: errors.date_of_birth?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>


              <FormControl fullWidth margin="dense">
                <FormLabel required>CCCD</FormLabel>
                <Controller
                  name="citizen_id"
                  control={methods.control}
                  rules={{
                    required: 'CCCD là bắt buộc',
                    pattern: {
                      value: /^\d{12}$/,
                      message: 'Số CCCD phải có 12 chữ số',
                    },
                    validate: checkCitizenId
                  }}
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
                <FormLabel required>Địa chỉ</FormLabel>
                <Controller
                  name="address"
                  control={methods.control}
                  rules={{
                    required: 'Địa chỉ là bắt buộc'
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Trạng thái hoạt động</FormLabel>
                <Controller
                  name="is_active"
                  control={methods.control}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Hoạt động" />
                      <FormControlLabel value="false" control={<Radio />} label="Không hoạt động" />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Loại hợp đồng</FormLabel>
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
                      {Object.values(RecruitmentType).map((r) => (
                        <MenuItem key={r} value={r}>{RecruitmentTypeLabel[r] ?? r}</MenuItem>
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
                      message: 'Trình độ học vấn phải có định dạng "x/12 (Ví dụ: 12/12)"',
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
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
                      {Object.values(TeachingSubject).map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <FormLabel>Số chứng chỉ giáo viên</FormLabel>
                <Controller
                  name="teacher_certificate_number"
                  control={methods.control}
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9/]+$/,
                      message: 'Số chứng chỉ chỉ được chứa chữ cái viết hoa, số, dấu gạch chéo và không có khoảng trắng',
                    },
                    validate: checkTeacherCertificateNumber
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                      error={!!errors.teacher_certificate_number}
                      helperText={errors.teacher_certificate_number?.message}
                    />
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
                      fullWidth
                      variant="outlined"
                      error={!!errors.teacher_certificate_issue_place}
                      helperText={errors.teacher_certificate_issue_place?.message}
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
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9\/_-]+$/,
                      message: 'Số chứng chỉ chỉ được chứa chữ cái viết hoa, số, dấu gạch chéo, gạch dưới, gạch ngang và không có khoảng trắng',
                    },
                    validate: checkHealthCertificateNumber
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth
                      variant="outlined"
                      error={!!errors.health_certificate_number}
                      helperText={errors.health_certificate_number?.message}
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
                <FormLabel>Số hợp đồng</FormLabel>
                <Controller
                  name="contract_number"
                  control={methods.control}
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9\/_-]+$/,
                      message: 'Số hợp đồng chỉ được chứa chữ cái viết hoa, số, dấu gạch chéo, gạch dưới, gạch ngang và không có khoảng trắng',
                    },
                    validate: checkContractNumber
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      fullWidth variant="outlined"
                      error={!!errors.contract_number}
                      helperText={errors.contract_number?.message}
                    />
                  )}
                />
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
              <Button onClick={onClose}>Hủy</Button>
              <Button type="submit" variant="contained">Lưu</Button>
            </DialogActions>
          </Form>
        )}
      </Dialog>
    );
  }
);