const checkFrontend = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000");
      if (response.status === 200) {
        console.log("Frontend is running");
      } else { console.log("Frontend returned unexpected status");
      }
    } catch (e) {
        console.log("Could not reach frontend");
    }
}; 

checkFrontend();