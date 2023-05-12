import React, { useEffect, useRef, useState } from "react";

export default function useDrwaer() {
  const [drawOption, setDrawOption] = useState({
    isOpen: false,
    drawerWidth: true,
    isFix: true,
  });

  const openDrawer = () => {
    if (!drawOption.isFix) {
      setDrawOption((state) => ({
        ...state,
        drawerWidth: false,
      }));
    }
    setDrawOption((state) => ({
      ...state,
      isOpen: true,
    }));
  };

  const handleClose = () => {
    setDrawOption((state) => ({
      ...state,
      isOpen: false,
      drawerWidth: true,
    }));
  };

  const useClickOutside = (ref: any, onClickOutside: any) => {
    const handleClick = (e: any) => {
      const target = document.getElementsByClassName("left-sider-drawer")[0];
      const target_btn = document.getElementsByClassName("left-sider-btn")[0];
      if (
        ref.current &&
        !target.contains(e.target) &&
        !target_btn.contains(e.target) &&
        drawOption.isFix
      ) {
        onClickOutside();
      }
    };

    useEffect(() => {
      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    });
  };

  const handleClickOutside = () => {
    setDrawOption((state) => ({
      ...state,
      isOpen: false,
      drawerWidth: true,
    }));
  };

  const antdDrawRef = useRef(null);

  useClickOutside(antdDrawRef, handleClickOutside);

  const handleFix = () => {
    setDrawOption((state) => ({
      ...state,
      drawerWidth: !state.drawerWidth,
      isFix: !state.isFix,
    }));
  };
  return {
    drawOption,
    openDrawer,
    handleClose,
    handleFix,
    antdDrawRef,
  };
}
