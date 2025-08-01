import { useEffect, useState } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar"
import { Folders, HomeIcon, SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";
import { useAuth } from "./Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const links = [
  {
    label: "Repositories",
    href: "/dashboard/",
    icon: <div><Folders/></div>
  },
  {
    label:"Home",
    href:"/",
    icon:<div><HomeIcon/></div>
  }
]

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const auth = useAuth();
  const navigation = useNavigate();

  useEffect(() => {
    if(!code && !auth?.authStatus) {
      toast.error("Please login to access the dashboard")
      navigation("/");
    }

    const postCode = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/github/auth/callback",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        const result = await response.json();
        setAuthStatus(result?.message?.split(" ")[1]);
        localStorage.setItem("token", JSON.stringify(result.token));
        auth?.setAuthStatus(result.token);
        toast.success("Congratulations, successfully logged in!");
      } 
      catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    };

    if (code) {
      postCode();
    }
  }, []);

  if(code && authStatus === null) {
    return <div className="flex w-full h-screen justify-center items-center">
      <img src="/animatedlogogif.gif" alt="loading"/>
    </div>
  }

  if(code && authStatus === "Failure") {
    toast.error("Authentication failed");
    localStorage.setItem("token", "");
    auth?.setAuthStatus(null);
    navigation("/");
  }

  if((code && authStatus === "Successful") || (!code && auth?.authStatus)) {
    return (
      <div className="flex min-h-screen w-full text-white bg-[#0A0A0A]">
        <Sidebar open={open} setOpen={setOpen} animate={true}>
          <SidebarBody>
            <div className="py-4">
              {open ? <SidebarCloseIcon/> : <SidebarOpenIcon/> }
            </div>
            <div className="flex flex-col gap-2 py-4">
              {links.map((link, index) => <SidebarLink key={index} link={link} className="gap-4"/>)}
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="bg-primary w-full rounded-tl-[3rem]">
          {children}
        </div>
      </div>
    )
  }
}

export default Dashboard