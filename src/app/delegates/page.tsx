import React, { useMemo, useState } from "react";

import {
  Checkbox,
  Container,
  Dropdown,
  Grid,
  Header,
  Menu,
  Segment,
} from "semantic-ui-react";

import "./page.css";

import DelegatesOfRegion, { ALL_REGIONS } from "./DelegatesOfRegion";
import useHash from "../../types/hooks/useHash";
import DelegatesOfAllRegion from "./DelegatesOfAllRegion";
import { fetchUserGroups } from "@/api/usersGroups";
import { GroupType, UserGroup } from "@/types/userGroups";
import fetchLoggedInUserPermissions from "@/lib/fetchLoggedInUserPermissions";

export default async function Delegates() {
  const loggedInUserPermissions = await fetchLoggedInUserPermissions();

  const delegateGroups = await fetchUserGroups({
    groupTypes: GroupType.delegateRegions,
    sort: "name",
    isActive: true,
  });

  const delegateRegions = React.useMemo(
    () =>
      delegateGroups?.filter((group) => group.parent_group_id === null) || [],
    [delegateGroups]
  );

  const delegateSubregions = React.useMemo(
    () =>
      delegateGroups?.reduce((_delegateSubregions, group) => {
        if (group.parent_group_id) {
          const parentGroup = delegateGroups.find(
            (parent) => parent.id === group.parent_group_id
          );
          if (parentGroup) {
            const updatedSubregions = { ..._delegateSubregions };
            updatedSubregions[parentGroup.id] =
              updatedSubregions[parentGroup.id] || [];
            updatedSubregions[parentGroup.id].push(group);
            return updatedSubregions;
          }
        }
        return _delegateSubregions;
      }, {} as Record<number, UserGroup[]>),
    [delegateGroups]
  );

  const [hash, setHash] = useHash();
  const isAllRegions = hash === ALL_REGIONS.id;

  const activeRegion = React.useMemo(() => {
    if (isAllRegions) return ALL_REGIONS;
    const selectedRegionIndex = delegateRegions.findIndex(
      (region) => region.metadata.friendly_id === hash
    );
    if (selectedRegionIndex === -1 && delegateRegions.length > 0) {
      setHash(delegateRegions[0]?.metadata.friendly_id);
      return null;
    }
    return delegateRegions[selectedRegionIndex];
  }, [delegateRegions, hash, isAllRegions, setHash]);

  const [toggleAdmin, setToggleAdmin] = useState(false);
  const isAdminMode =
    toggleAdmin ||
    (activeRegion === ALL_REGIONS &&
      loggedInUserPermissions.canViewDelegateAdminPage);
  const menuOptions = useMemo(() => {
    const options = delegateRegions.map((region) => ({
      id: region.id,
      text: region.name,
      friendlyId: region.metadata.friendly_id,
    }));
    if (isAdminMode) {
      options.push({
        id: ALL_REGIONS.id,
        text: ALL_REGIONS.name,
        friendlyId: ALL_REGIONS.id,
      });
    }
    return options;
  }, [delegateRegions, isAdminMode]);

  return (
    <Container fluid>
      <Header as="h1">CA Delegates</Header>
      <div>
        <p>
          <strong>WCA Delegate</strong> is a role defined in the WCA Motions and
          depicted in the WCA Regulations. The primary duty of a Delegate is to
          oversee competitions on behalf of the WCA. A WCA Delegate is
          responsible for making sure that all WCA Competitions are run
          according to the Mission, Spirit, and Regulations of the WCA. The WCA
          distinguishes between <strong>Senior Delegates</strong>,{" "}
          <strong>Regional Delegates</strong>, <strong>Full Delegates</strong>,{" "}
          <strong>Junior Delegates</strong>, and{" "}
          <strong>Trainee Delegates</strong>%{see_link}.
        </p>
        <p>
          In addition to the duties of a WCA Delegate, a Senior Delegate or
          Regional Delegate is responsible for managing the WCA Delegates in
          their area and can also be contacted by the community for regional
          matters.
        </p>
        <p>
          New Delegates are listed as Junior Delegates at first; afterwards they
          are requested to show proficiency managing WCA Competitions before
          being promoted to WCA Delegates.
        </p>
        <p>
          Trainee Delegates are being trained for the position of WCA Delegate
          and can only oversee competitions in which a WCA Delegate is present.
        </p>
      </div>
      <p>The WCA acknowledges the following WCA Delegates:z</p>
      {loggedInUserPermissions.canViewDelegateAdminPage && (
        <Checkbox
          label="Enable admin mode"
          toggle
          checked={isAdminMode}
          onChange={(__, { checked }) => setToggleAdmin(checked)}
        />
      )}
      <Grid centered>
        <Grid.Row>
          <Grid.Column only="computer" computer={4}>
            <Header>Regions</Header>
            <Menu vertical fluid>
              {menuOptions.map((option) => (
                <Menu.Item
                  key={option.id}
                  content={option.text}
                  active={option.friendlyId === hash}
                  onClick={() => setHash(option.friendlyId)}
                />
              ))}
            </Menu>
          </Grid.Column>

          <Grid.Column computer={12} mobile={16} tablet={16}>
            <Segment>
              <Grid centered>
                <Grid.Row only="computer">
                  <Header>{activeRegion.name}</Header>
                </Grid.Row>
                <Grid.Row only="tablet mobile">
                  <Dropdown
                    inline
                    options={menuOptions.map((option) => ({
                      key: option.id,
                      text: option.text,
                      value: option.friendlyId,
                    }))}
                    value={hash}
                    onChange={(__, { value }) => setHash(value)}
                  />
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    {isAllRegions ? (
                      <DelegatesOfAllRegion />
                    ) : (
                      <DelegatesOfRegion
                        activeRegion={activeRegion}
                        delegateSubregions={
                          delegateSubregions[activeRegion.id] || []
                        }
                        isAdminMode={isAdminMode}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
