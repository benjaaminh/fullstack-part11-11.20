import { View, Pressable, ImageBackground, Text } from "react-native";
import { useState } from "react";
import { Link } from 'react-router-native';
import TextInput from "./TextInput";
import { useFormik } from 'formik';
import theme from "../theme";
import * as yup from "yup";

const initialValues = {
    username: '',
    password: '',
    passwordConfirmation: '',
};

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required'),
    password: yup
        .string()
        .required('Password is required'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], "Password and password confirmation don't match") //check that the value matches reference to password
        .required('Password confirmation is required')
});

const SignUp = ({ onSignUp }) => {
    const [errorMessage, setErrorMessage] = useState(null);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async () => {
            if (!formik.isValid) {
                console.log("Form is not valid");
                return;
            }
            try {
                const error = await onSignUp(formik.values.username.toLowerCase(), formik.values.password);
                if (error) {
                    setErrorMessage(error); // Set error message from Main.jsx
                } else {
                    setErrorMessage(null); // Clear any previous error if successful
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
                setErrorMessage("An unexpected error occurred."); // Generic fallback message
            }
        },
    });
    

    return (
        <View style={theme.blueContainer}>
            <ImageBackground source={require('../../assets/BackgroundBinary.png')} style={theme.backgroundImage} >
                <View style={theme.pinkContainer}>
                    <View style={theme.arrowContainer}>
                        <Pressable>
                            <Link to="/">
                                <Text style={theme.arrow}>{"<"}</Text>
                            </Link>
                        </Pressable>
                    </View>

                    <Text style={theme.titlePode}>{"<Pode/>"}</Text>

                    {errorMessage && (
                        <Text style={theme.errorText}>{errorMessage}</Text>
                    )}

                    <TextInput
                        style={theme.inputField}
                        error={formik.errors.username}
                        placeholder="Username"
                        value={formik.values.username}
                        onChangeText={formik.handleChange('username')}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <Text style={theme.errorText}>{formik.errors.username}</Text>
                    )}
                    <TextInput
                        style={theme.inputField}
                        error={formik.errors.password}
                        secureTextEntry={true}
                        placeholder="Password"
                        value={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <Text style={theme.errorText}>{formik.errors.password}</Text>
                    )}
                    <TextInput
                        style={theme.inputField}
                        error={formik.errors.passwordConfirmation}
                        secureTextEntry={true}
                        placeholder="Password confirmation"
                        value={formik.values.passwordConfirmation}
                        onChangeText={formik.handleChange('passwordConfirmation')}
                    />
                    {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                        <Text style={theme.errorText}>{formik.errors.passwordConfirmation}</Text>
                    )}
                    <Pressable style={theme.purpleButton} onPress={formik.handleSubmit}>
                        <Text style={theme.purpleButtonText}>Register</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
};

export default SignUp;