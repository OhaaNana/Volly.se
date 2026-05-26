const checkBackend = async (): Promise<void> => {
  try {
    const response = await fetch("http://localhost:3001");
    if (response.status === 200) {
      console.log("Backend is running");
    } else {
      console.log("Backend returned unexpected status");
    }
  } catch {
    console.log("Could not reach backend");
  }
};

checkBackend();
