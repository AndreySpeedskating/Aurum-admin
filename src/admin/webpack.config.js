'use strict';
const path = require('path');

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/pages\/AuthPage\/components\/Login\/BaseLogin\.js/,
      path.resolve(__dirname, 'components/Login/BaseLogin.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/pages\/AuthPage\/index\.js/,
      path.resolve(__dirname, 'components/AuthPage/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/components\/LeftMenu\/index\.js/,
      path.resolve(__dirname, 'components/LeftMenu/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/pages\/ListView\/components\/CellContent\/CellValue\.js/,
      path.resolve(__dirname, 'components/CellValue/CellValue.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/pages\/ListView\/components\/CellContent\/index\.js/,
      path.resolve(__dirname, 'components/CellValue/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/pages\/ListView\/index\.js/,
      path.resolve(__dirname, 'components/ListView/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/pages\/ListView\/components\/BulkActionButtons\/index\.js/,
      path.resolve(__dirname, 'components/BulkActionButtons/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/pages\/EditView\/index\.js/,
      path.resolve(__dirname, 'components/EditView/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/pages\/EditView\/Header\/index\.js/,
      path.resolve(__dirname, 'components/EditView/Header/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/pages\/App\/index\.js/,
      path.resolve(__dirname, 'components/ContentManagerApp/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/components\/AttributeFilter\/Filters\.js/,
      path.resolve(__dirname, 'components/DisplayedFilters/Filters.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/components\/Inputs\/index\.js/,
      path.resolve(__dirname, 'components/Input/index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/components\/RelationInput\/RelationInput\.js/,
      path.resolve(__dirname, 'components/RelationInput/RelationInput.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/components\/RelationInput\/components\/RelationItem\.js/,
      path.resolve(__dirname, 'components/RelationInput/components/RelationItem.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/components\/RelationInputDataManager\/RelationInputDataManager\.js/,
      path.resolve(__dirname, 'components/content-manager/components/RelationInputDataManager.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/components\/RelationInputDataManager\/utils\/diffRelations\.js/,
      path.resolve(__dirname, 'components/content-manager/components/utils/diffRelations.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/content-manager\/hooks\/useRelation\/useRelation\.js/,
      path.resolve(__dirname, 'components/useRelation/useRelation.js')
    )
  );

  return config;
};
