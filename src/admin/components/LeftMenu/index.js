import React, { useEffect, useRef, useState } from 'react';

import { Box, Divider, Flex, FocusTrap, Typography } from '@strapi/design-system';
import {
  MainNav,
  NavBrand,
  NavCondense,
  NavFooter,
  NavLink,
  NavSection,
  NavSections,
  NavUser,
} from '@strapi/design-system/v2';
import {
  auth,
  getFetchClient,
  useAppInfo,
  usePersistentState,
  useTracking,
} from '@strapi/helper-plugin';
import { useSelector } from 'react-redux';
import { Exit } from '@strapi/icons';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { NavLink as RouterNavLink, useHistory, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { useConfigurations } from '../../hooks';

const Application = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z"></path></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path></svg>
);

const AutoParkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path></svg>
);

const CargoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"></path></svg>
);

const CounterpartieIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H53.39a8,8,0,0,0,7.23-4.57,48,48,0,0,1,86.76,0,8,8,0,0,0,7.23,4.57H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM80,144a24,24,0,1,1,24,24A24,24,0,0,1,80,144Zm136,56H159.43a64.39,64.39,0,0,0-28.83-26.16,40,40,0,1,0-53.2,0A64.39,64.39,0,0,0,48.57,200H40V56H216ZM56,96V80a8,8,0,0,1,8-8H192a8,8,0,0,1,8,8v96a8,8,0,0,1-8,8H176a8,8,0,0,1,0-16h8V88H72v8a8,8,0,0,1-16,0Z"></path></svg>
);

const LoadingPointIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Zm-42.34-77.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,148.69V88a8,8,0,0,1,16,0v60.69l18.34-18.35A8,8,0,0,1,165.66,130.34Z"></path></svg>
);

const UnloadingPointIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208ZM90.34,125.66a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32L136,107.31V168a8,8,0,0,1-16,0V107.31l-18.34,18.35A8,8,0,0,1,90.34,125.66Z"></path></svg>
);

const DictionariesIcon = {
  User: <UserIcon />,
  AutoPark: <AutoParkIcon />,
  Cargo: <CargoIcon />,
  Counterpartie: <CounterpartieIcon />,
  LoadingPoint: <LoadingPointIcon />,
  UnloadingPoint: <UnloadingPointIcon />,
};

const Logo = styled.img`
  height: 42px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: ${({ active }) => active ? '100%' : '43px' };
  min-height: 42px;
  margin: 12px 12px;
  overflow: hidden;
`;

const LinkUserWrapper = styled(Box)`
  width: ${150 / 16}rem;
  position: absolute;
  bottom: ${({ theme }) => theme.spaces[9]};
  left: ${({ theme }) => theme.spaces[5]};
`;

const LinkUser = styled(RouterNavLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[4]}`};
  border-radius: ${({ theme }) => theme.spaces[1]};

  &:hover {
    background: ${({ theme, logout }) =>
      logout ? theme.colors.danger100 : theme.colors.primary100};
    text-decoration: none;
  }

  svg {
    path {
      fill: ${({ theme }) => theme.colors.danger600};
    }
  }
`;

const LeftMenu = ({ generalSectionLinks, pluginsSectionLinks }) => {
  const buttonRef = useRef();
  const [userLinksVisible, setUserLinksVisible] = useState(false);
  const {
    logos: { menu },
  } = useConfigurations();
  const [condensed, setCondensed] = usePersistentState('navbar-condensed', false);
  const [dictionaries, setDictionaries] = useState([]);
  const { userDisplayName } = useAppInfo();
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const { pathname } = useLocation();
  const history = useHistory();
  const { get, post } = getFetchClient();

  const initials = userDisplayName
    .split(' ')
    .map((name) => name.substring(0, 1))
    .join('')
    .substring(0, 2);

  const handleToggleUserLinks = () => setUserLinksVisible((prev) => !prev);

  const handleLogout = async () => {
    await post('/admin/logout');
    auth.clearAppStorage();
    handleToggleUserLinks();
    history.push('/auth/login');
  };

  const getTypes = async () => {
    await get('content-manager/init').then((response) => {
      const results = response?.data?.data?.contentTypes;
      const collectionTypes = Object.keys(results)?.reduce((acc, key) => {
        if (results[key]?.kind === "collectionType" && results[key]?.isDisplayed && results[key]?.apiID !== 'application') {
          return [...acc, results[key]];
        }
        return [...acc];
      }, []);
      setDictionaries(collectionTypes);
    });
  };

  useEffect(() => {
    getTypes();
  }, []);

  const handleBlur = (e) => {
    if (
      !e.currentTarget.contains(e.relatedTarget) &&
      e.relatedTarget?.parentElement?.id !== 'main-nav-user-button'
    ) {
      setUserLinksVisible(false);
    }
  };

  const handleClickOnLink = (destination = null) => {
    trackUsage('willNavigate', { from: pathname, to: destination });
  };

  return (
    <MainNav condensed={condensed}>
      <LogoWrapper active={!condensed}>
        <Logo
          src={menu.custom || menu.default}
          alt={formatMessage({
            id: 'app.components.LeftMenu.logo.alt',
            defaultMessage: 'Application logo',
          })}
        />
      </LogoWrapper>

      <Divider />

      <NavSections id="nav_sections_container">
        <NavSection
          id="dictionariesRef"
          label={`${formatMessage({
            id: 'app.components.LeftMenu.documents',
            defaultMessage: 'Documents',
          })}`}
        >
          <NavLink
            as={RouterNavLink}
            to="/content-manager/collectionType/api::application.application?page=1&pageSize=10&sort=SendDate:DESC"
            icon={<Application />}
            onClick={() => handleClickOnLink('/content-manager/collectionType/api::application.application?page=1&pageSize=10&SendDate:DESC')}
          >
            {formatMessage({ id: 'Application', defaultMessage: 'Application' })}
          </NavLink>
        </NavSection>
        
        <NavSection
          id="dictionariesRef"
          label={`${formatMessage({
            id: 'app.components.LeftMenu.dictionaries',
            defaultMessage: 'Dictionaries',
          })}`}
        >
        {dictionaries?.map((dictionary) => (
          <NavLink icon={DictionariesIcon[dictionary?.info?.displayName]} to={`/content-manager/collectionType/${dictionary?.uid}?page=1&pageSize=10`} as={RouterNavLink}>
            {formatMessage({ id: `${dictionary?.info?.displayName}` })}
          </NavLink>
        ))}
        </NavSection>

        {pluginsSectionLinks.length > 0 ? (
          <NavSection
            label={formatMessage({
              id: 'app.components.LeftMenu.reports',
              defaultMessage: 'Reports',
            })}
          >
            {pluginsSectionLinks?.filter((link) => link?.to !== '/plugins/upload').map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  as={RouterNavLink}
                  to={link.to}
                  key={link.to}
                  icon={<Icon />}
                  onClick={() => handleClickOnLink(link.to)}
                >
                  {formatMessage(link.intlLabel)}
                </NavLink>
              );
            })}
          </NavSection>
        ) : null}

        {generalSectionLinks.length > 1 ? (
          <NavSection
            label={formatMessage({
              id: 'app.components.LeftMenu.general',
              defaultMessage: 'General',
            })}
          >
            {generalSectionLinks?.filter((l) => l?.to === '/settings').map((link) => {
              const LinkIcon = link.icon;

              return (
                <NavLink
                  as={RouterNavLink}
                  badgeContent={
                    (link.notificationsCount > 0 && link.notificationsCount.toString()) || undefined
                  }
                  to={link.to}
                  key={link.to}
                  icon={<LinkIcon />}
                  onClick={() => handleClickOnLink(link.to)}
                >
                  {formatMessage(link.intlLabel)}
                </NavLink>
              );
            })}
          </NavSection>
        ) : null}
      </NavSections>

      <NavFooter>
        <NavUser
          id="main-nav-user-button"
          ref={buttonRef}
          onClick={handleToggleUserLinks}
          initials={initials}
        >
          {userDisplayName}
        </NavUser>
        {userLinksVisible && (
          <LinkUserWrapper
            onBlur={handleBlur}
            padding={1}
            shadow="tableShadow"
            background="neutral0"
            hasRadius
          >
            <FocusTrap onEscape={handleToggleUserLinks}>
              <Flex direction="column" alignItems="stretch" gap={0}>
                <LinkUser tabIndex={0} onClick={handleToggleUserLinks} to="/me">
                  <Typography>
                    {formatMessage({
                      id: 'global.profile',
                      defaultMessage: 'Profile',
                    })}
                  </Typography>
                </LinkUser>
                <LinkUser tabIndex={0} onClick={handleLogout} to="/auth/login">
                  <Typography textColor="danger600">
                    {formatMessage({
                      id: 'app.components.LeftMenu.logout',
                      defaultMessage: 'Logout',
                    })}
                  </Typography>
                  <Exit />
                </LinkUser>
              </Flex>
            </FocusTrap>
          </LinkUserWrapper>
        )}

        <NavCondense onClick={() => setCondensed((s) => !s)}>
          {condensed
            ? formatMessage({
                id: 'app.components.LeftMenu.expand',
                defaultMessage: 'Expand the navbar',
              })
            : formatMessage({
                id: 'app.components.LeftMenu.collapse',
                defaultMessage: 'Collapse the navbar',
              })}
        </NavCondense>
      </NavFooter>
    </MainNav>
  );
};

LeftMenu.propTypes = {
  generalSectionLinks: PropTypes.array.isRequired,
  pluginsSectionLinks: PropTypes.array.isRequired,
};

export default LeftMenu;
