import React, { useState, useCallback, useMemo } from "react";
import { sortBy } from "lodash";
import NavigationTabsContext, {
  NavigationTabItem,
} from "./NavigationTabsContext";

type Props = {
  children: React.ReactNode;
};

function NavigationTabsProvider({ children }: Props) {
  const [navigationTabItems, setNavigationTabItems] = useState<
    NavigationTabItem[]
  >([]);

  const registerNavigationTabItem = useCallback(
    (addItem: NavigationTabItem) => {
      setNavigationTabItems((items) => {
        let exist = false;

        const next = items.map((item) => {
          if (item.url === addItem.url) {
            exist = true;
            return addItem;
          }
          return {
            ...item,
            active: false,
          };
        });

        if (!exist) {
          next.push({
            ...addItem,
            active: true,
          });
        }
        return next;

        // return sortBy(
        //   [
        //     ...items.filter((item) => item.url !== addItem.url),
        //     { ...addItem, active: true },
        //   ]
        //   //(sortItem) => sortItem.url
        // );
      });
    },
    [setNavigationTabItems]
  );

  const unregisterNavigationTabItem = useCallback(
    (url: string) => {
      setNavigationTabItems((items) => {
        return sortBy(
          items.filter((item) => item.url !== url),
          (sortItem) => sortItem.url
        );
      });
    },
    [setNavigationTabItems]
  );

  const NavigationTabsContextValue = useMemo(
    () => ({
      items: navigationTabItems,
      registerItem: registerNavigationTabItem,
      unregisterItem: unregisterNavigationTabItem,
    }),
    [navigationTabItems, registerNavigationTabItem, unregisterNavigationTabItem]
  );

  return (
    <NavigationTabsContext.Provider value={NavigationTabsContextValue}>
      {children}
    </NavigationTabsContext.Provider>
  );
}

export default NavigationTabsProvider;
