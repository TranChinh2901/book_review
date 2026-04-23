export async function submitForm(action, setErrors) {
  try {
    setErrors({});
    await action();
  } catch (error) {
    setErrors(error.fields ?? { form: error.message });
  }
}
