export const getAllProjects = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/project`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  };