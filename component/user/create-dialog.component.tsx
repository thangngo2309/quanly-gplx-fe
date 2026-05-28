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

import { RecruitmentType, RecruitmentTypeLabel, TeachingSubject, UserRole } from "@/enum/user.enum";
import { CreateUserModel} from "@/model/user.model";
import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { CreateUserDialogProps } from "@/model/user-dialog-props";

export const CreateDialog = memo(
    ({ open, onClose, onSave }: CreateUserDialogProps) => {

        const methods = useForm<CreateUserModel>({
            mode: 'onTouched',
            reValidateMode: 'onChange',
            defaultValues: { role: UserRole.USER},
        });

        const errors = methods.formState.errors;

        useEffect(() => { if (open) { methods.reset();}}, [open]);

        const onSubmit: SubmitHandler<CreateUserModel> = async (data) => {onSave(data);};

        return (
            <Dialog
                open={open}
                onClose={onClose}
                keepMounted
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
                                <FormLabel>Tên đăng nhập</FormLabel>
                                <Controller
                                    name="username"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập tên đăng nhập',
                                        minLength: {
                                            value: 3,
                                            message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message:
                                                'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
                                        }
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
                                <FormLabel>Mật khẩu</FormLabel>
                                <Controller
                                    name="password"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập mật khẩu',
                                        minLength: {
                                            value: 6,
                                            message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}

                                            type="password"
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel>Họ và tên</FormLabel>
                                <Controller
                                    name="fullname"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập họ và tên'
                                    }}
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
                                    rules={{
                                        required: 'Vui lòng nhập ngày sinh'
                                    }}
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
                                    rules={{
                                        required: 'Vui lòng nhập số CCCD'
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
                                <FormLabel>Vai trò</FormLabel>
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
                                <FormLabel>Địa chỉ</FormLabel>
                                <Controller
                                    name="address"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập địa chỉ'
                                    }}
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