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
    Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RecruitmentType, RecruitmentTypeLabel, TeachingSubject, UserPedagogyLevel, UserRole } from "@/enum/user.enum";
import { CreateUserModel } from "@/model/user.model";
import { memo, useEffect, useState } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { CreateUserDialogProps } from "@/model/user-dialog-props";
import dayjs from 'dayjs';
import { debouncedUniqueUsername, debouncedUniqueCitizenId, debouncedUniqueTeacherCert, debouncedUniqueHealthCert, debouncedUniqueContract, debouncedUniquePhoneNumber, debouncedUniqueEmail } from "@/utils/debounced-user";
import { autoTrim, emptyToNull } from "@/utils/format-input";
import { DatePickerField } from "../date-picker.component";

export const CreateDialog = memo(
    ({ open, onClose, onSave, role }: CreateUserDialogProps) => {
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const methods = useForm<CreateUserModel>({
            mode: 'all',
            reValidateMode: 'onChange',
            defaultValues: {
                role: UserRole.USER
            },
        });

        const errors = methods.formState.errors;
        const isTeacher = role === UserRole.TEACHER;

        useEffect(() => { if (open) { methods.reset(); } }, [open]);

        const onSubmit: SubmitHandler<CreateUserModel> = async (data) => {
            const { confirmPassword, ...formData } = data;

            onSave({
                ...formData,
                role: role,
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

        const checkPhoneNumber = async (value: string) => {
            if (!value) return true;
            const res = await debouncedUniquePhoneNumber(value);
            return res || 'Số điện thoại đã tồn tại';
        }

        const checkEmail = async (value: string) => {
            if (!value) return true;
            const res = await debouncedUniqueEmail(value);
            return res || 'Email đã tồn tại';
        }

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
                                            placeholder="********"
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
                                            placeholder="********"
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

                            <DatePickerField
                                name="date_of_birth"
                                control={methods.control}
                                label="Ngày sinh"
                                required
                                error={!!errors.date_of_birth}
                                helperText={errors.date_of_birth?.message}
                                rules={{
                                    required: 'Vui lòng nhập ngày sinh',
                                    validate: {
                                        minAge: (value: Date) => {
                                            if (!value) return true;
                                            const d = dayjs(value).startOf('day');
                                            const today = dayjs().startOf('day');
                                            return today.diff(d, 'year') >= 18 || 'Người dùng phải từ 18 tuổi trở lên';
                                        }
                                    }
                                }}
                            />

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
                                            placeholder="VD: 079123456789 (12 ký tự số)"
                                            variant="outlined"
                                            error={!!errors.citizen_id}
                                            helperText={
                                                errors.citizen_id?.message
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    maxLength: 12,
                                                },
                                            }}
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
                                <FormLabel required>Số điện thoại</FormLabel>
                                <Controller
                                    name="phone_number"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập số điện thoại',
                                        pattern: {
                                            value: /^0[0-9]{1,9}$/,
                                            message: 'Số điện thoại có tối đa 10 chữ số và bắt đầu bằng số 0'
                                        },
                                        validate: checkPhoneNumber
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Ví dụ: 0912345678"
                                            onChange={(e) => {
                                                const formatted = autoTrim(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.phone_number}
                                            helperText={errors.phone_number?.message}
                                            slotProps={{
                                                htmlInput: {
                                                    maxLength: 10,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Email</FormLabel>
                                <Controller
                                    name="email"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập email',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Vui lòng nhập email hợp lệ'
                                        },
                                        validate: checkEmail
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Ví dụ: example@email.com"
                                            onChange={(e) => {
                                                const formatted = autoTrim(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <DatePickerField
                                name="test_date_time"
                                control={methods.control}
                                label="Ngày kiểm tra"
                                error={!!errors.test_date_time}
                                helperText={errors.test_date_time?.message}
                                type="datetime"
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
                                        <FormLabel>Số chứng nhận giáo viên</FormLabel>
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
                                                    placeholder="VD: 2017/387848"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={!!errors.teacher_certificate_number}
                                                    helperText={errors.teacher_certificate_number?.message}
                                                />
                                            )}
                                        />
                                    </FormControl>

                                    <DatePickerField
                                        name="teacher_certificate_issue_date"
                                        control={methods.control}
                                        label="Ngày cấp chứng nhận giáo viên"
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
                                            Nơi cấp chứng nhận giáo viên
                                        </FormLabel>
                                        <Controller
                                            name="teacher_certificate_issue_place"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    fullWidth
                                                    placeholder="VD: Sở Xây dựng Đà Nẵng"
                                                    variant="outlined"
                                                    error={!!errors.teacher_certificate_issue_place}
                                                    helperText={errors.teacher_certificate_issue_place?.message}
                                                />
                                            )}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth margin="dense">
                                        <FormLabel>
                                            Số giấy khám sức khỏe
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
                                                    placeholder="VD: SK/19283"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={!!errors.health_certificate_number}
                                                    helperText={errors.health_certificate_number?.message}
                                                />
                                            )}
                                        />
                                    </FormControl>

                                    <DatePickerField
                                        name="health_certificate_expiry_date"
                                        control={methods.control}
                                        label="Ngày hết hạn giấy khám sức khỏe"
                                        error={!!errors.health_certificate_expiry_date}
                                        helperText={errors.health_certificate_expiry_date?.message}
                                    />

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
                                                    placeholder="Ví dụ: HD/183828"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={!!errors.contract_number}
                                                    helperText={errors.contract_number?.message}
                                                />
                                            )}
                                        />
                                    </FormControl>

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