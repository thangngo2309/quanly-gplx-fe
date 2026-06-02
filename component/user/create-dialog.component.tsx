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
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RecruitmentType, RecruitmentTypeLabel, TeachingSubject, UserPedagogyLevel, UserRole } from "@/enum/user.enum";
import { CreateUserModel } from "@/model/user.model";
import { memo, useEffect, useState } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { CreateUserDialogProps } from "@/model/user-dialog-props";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { debouncedUniqueUsername, debouncedUniqueCitizenId, debouncedUniqueTeacherCert, debouncedUniqueHealthCert, debouncedUniqueContract } from "@/utils/debounced-user";
import { emptyToNull } from "@/utils/format-input";

export const CreateDialog = memo(
    ({ open, onClose, onSave }: CreateUserDialogProps) => {
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const methods = useForm<CreateUserModel>({
            mode: 'onChange',
            reValidateMode: 'onChange',
            defaultValues: {
                role: UserRole.USER,
            },
        });

        const errors = methods.formState.errors;

        useEffect(() => { if (open) { methods.reset(); } }, [open]);

        const onSubmit: SubmitHandler<CreateUserModel> = async (data) => {
            const { confirmPassword, ...formData } = data;

            onSave({
                ...formData,
                recruitment_type: emptyToNull(formData.recruitment_type),
                pedagogy_level: emptyToNull(formData.pedagogy_level),
                teaching_subject: emptyToNull(formData.teaching_subject),
            });
        };

        const checkUsername = async (value: string) => {
            if (!value) return true;
            const res = await debouncedUniqueUsername(value);
            return res || 'Tên đăng nhập đã tồn tại';
        };

        const checkCitizenId = async (value: string) => {
            if (!value) return true;
            const res = await debouncedUniqueCitizenId(value);
            return res || 'Số CCCD đã tồn tại';
        };

        const checkTeacherCertificateNumber = async (value: string | undefined) => {
            if (!value) return true;
            const res = await debouncedUniqueTeacherCert(value);
            return res || 'Số chứng chỉ giáo viên đã tồn tại';
        };

        const checkHealthCertificateNumber = async (value: string | undefined) => {
            if (!value) return true;
            const res = await debouncedUniqueHealthCert(value);
            return res || 'Số chứng chỉ sức khỏe đã tồn tại';
        };

        const checkContractNumber = async (value: string | undefined) => {
            if (!value) return true;
            const res = await debouncedUniqueContract(value);
            return res || 'Số hợp đồng đã tồn tại';
        };

        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Thêm người dùng mới</DialogTitle>

                {open && (
                    <Form<CreateUserModel>
                        onSubmit={onSubmit}
                        methods={methods}
                    >
                        <DialogContent>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Tên đăng nhập</FormLabel>
                                <Controller
                                    name="username"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập tên đăng nhập',
                                        validate: checkUsername
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.username}
                                            helperText={errors.username?.message}
                                        />
                                    )}
                                />

                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Mật khẩu</FormLabel>
                                <Controller
                                    name="password"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập mật khẩu',
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                            message: 'Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm 1 chữ hoa, 1 chữ thường, 1 số, 1 kí tự đặc biệt và không chứa khoảng trắng'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                methods.trigger('confirmPassword');
                                            }}
                                            value={field.value ?? ''}
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>


                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Xác nhận mật khẩu</FormLabel>
                                <Controller
                                    name="confirmPassword"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng xác nhận mật khẩu',
                                        validate: (value) =>
                                            value === methods.watch('password') ||
                                            'Mật khẩu xác nhận không khớp'
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            type={showConfirmPassword ? "text" : "password"}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword?.message}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Họ và tên</FormLabel>
                                <Controller
                                    name="fullname"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập họ và tên',
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
                                            placeholder="Ví dụ: Nguyễn Văn An"
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
                                            required: 'Vui lòng nhập ngày sinh',
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
                                        required: 'Vui lòng nhập số CCCD',
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
                                            placeholder="Ví dụ: 123456789012"
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
                                <FormLabel required>Vai trò</FormLabel>
                                <Controller
                                    name="role"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            select
                                            fullWidth
                                            variant="outlined"
                                        >
                                            {Object.values(UserRole).map((role) => (
                                                <MenuItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Địa chỉ</FormLabel>
                                <Controller
                                    name="address"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập địa chỉ',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Ví dụ: xóm A, xã B, Tỉnh C"
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.address}
                                            helperText={errors.address?.message}
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
                                            placeholder="Ví dụ: Đại học, Cao đẳng + Chuyên ngành"
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.professional_level}
                                            helperText={errors.professional_level?.message}
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
                                            select
                                        >
                                            <MenuItem value="">-- Trống --</MenuItem>
                                            {Object.values(UserPedagogyLevel).map((level) => (
                                                <MenuItem key={level} value={level}>
                                                    {level}
                                                </MenuItem>
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
                                <FormLabel>Số chứng chỉ giáo viên</FormLabel>
                                <Controller
                                    name="teacher_certificate_number"
                                    control={methods.control}
                                    rules={{
                                        pattern: {
                                            value: /^[A-Z0-9/-]+$/,
                                            message: 'Số chứng chỉ chỉ được chứa chữ cái viết hoa, số, dấu gạch ngang, dấu gạch chéo và không có khoảng trắng',
                                        },
                                        validate: checkTeacherCertificateNumber
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Ví dụ: SP12345678"
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
                                            placeholder="Ví dụ: Sở Giáo dục và Đào tạo TP.HCM"
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
                                            placeholder="Ví dụ: CCSK12345678"
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
                                <FormLabel>
                                    Số hợp đồng
                                </FormLabel>
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
                                            placeholder="Ví dụ: HD12345678"
                                            fullWidth
                                            variant="outlined"
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