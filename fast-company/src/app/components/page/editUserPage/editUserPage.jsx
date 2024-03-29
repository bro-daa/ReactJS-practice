import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radio.Field";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useProfessions } from "../../../hooks/useProfession";
import { useQualities } from "../../../hooks/useQualities";
import { useAuth } from "../../../hooks/useAuth";
import { isArray } from "lodash";

const EditUserPage = () => {
    const { userId } = useParams();
    const { professions } = useProfessions();
    const { qualities } = useQualities();
    const { currentUser, updateUser } = useAuth();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        profession: "",
        sex: "male",
        qualities: []
    });
    const [errors, setErrors] = useState({});

    const professionsList = professions.map((p) => ({
        label: p.name,
        value: p._id
    }));

    const qualitiesList = qualities.map((q) => ({
        label: q.name,
        value: q._id
    }));

    const transformQualities = (arr, itemArr) => {
        const transformedArr = [];
        if (isArray(arr) && arr.length !== 0) {
            arr.forEach((id) => {
                itemArr.forEach((item) => {
                    if (item._id === id) {
                        transformedArr.push({
                            label: item.name,
                            value: item._id
                        });
                    }
                });
            });
        }
        return transformedArr;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        updateUser(userId, {
            ...data,
            qualities: data.qualities.map((e) => e.value)
        });
    };

    useEffect(() => {
        if (currentUser._id !== userId) {
            history.push(`/users/${currentUser._id}/edit`);
        }
        setIsLoading(true);
        setData((prevState) => ({
            ...prevState,
            ...currentUser,
            qualities: transformQualities(currentUser.qualities, qualities)
        }));
    }, []);

    useEffect(() => {
        if (data._id) {
            setIsLoading(false);
        }
    }, [data]);

    const validatorConfog = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            },
            min: {
                message: "Имя должно быть не менее 3 символов",
                value: 3
            }
        }
    };

    useEffect(() => validate(), [data]);

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const validate = () => {
        const errors = validator(data, validatorConfog);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValid = Object.keys(errors).length === 0;

    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading && Object.keys(professions).length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                name="profession"
                                options={professionsList}
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities}
                                options={qualitiesList}
                                onChange={handleChange}
                                values
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
