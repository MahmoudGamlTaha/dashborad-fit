
    num = sessionStorage.getItem('num');
    if(num !== '$2a$08$b0MHMsT3ErLoTRjpjzsCieW3cg.D3e9TSvGCk8FEEPOeb5FR2pO7O')
    {
        window.location.replace("./index.html");
    }

    function check()
    {
        sessionStorage.removeItem('num');
    }