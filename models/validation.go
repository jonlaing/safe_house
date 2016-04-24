package models

type ValidationError interface {
	Field() string
	Error() string
}

type ValidationErrors []ValidationError

func (ve ValidationErrors) ToMap() (errs map[string]string) {
	for _, e := range ve {
		errs[e.Field()] = e.Error()
	}
	return
}

type UsernameValidationError struct{}

func (e UsernameValidationError) Field() string {
	return "Username"
}

func (e UsernameValidationError) Error() string {
	return "Username can only have letters, numbers, dashes and underscores. Ex: my_username123"
}

type UserTypeValidationError struct{}

func (e UserTypeValidationError) Field() string {
	return "Type"
}

func (e UserTypeValidationError) Error() string {
	return "Invalid user type"
}

type UserTypeStatusValidationError struct{}

func (e UserTypeStatusValidationError) Field() string {
	return "Status"
}

func (e UserTypeStatusValidationError) Error() string {
	return "Invalid status for this user type"
}

type UserStatusValidationError struct{}

func (e UserTypeStatusValidationError) Field() string {
	return "Status"
}

func (e UserTypeStatusValidationError) Error() string {
	return "Invalid user status"
}

type UserTypeDurationValidationError struct{}

func (e UserTypeDurationValidationError) Field() string {
	return "Duration"
}

func (e UserTypeDurationValidationError) Error() string {
	return "Invalid housing duration for this user type"
}

type UserDurationValidationError struct{}

func (e UserDurationValidationError) Field() string {
	return "Duration"
}

func (e UserDurationValidationError) Error() string {
	return "Invalid housing duration"
}

type UserDurationValidationError struct{}

func (e UserDurationValidationError) Field() string {
	return "Duration"
}

func (e UserDurationValidationError) Error() string {
	return "Invalid housing duration"
}

type UserPasswordValidationError struct{}

func (e UserPasswordValidationError) Field() string {
	return "Password"
}

func (e UserPasswordValidationError) Error() string {
	return "Password and password confirmation don't match"
}
