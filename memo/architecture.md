# Architecture

## Directory

- app - application codes
  - presentation - stateless components
  - container - statefull(w/facade) components
  - page - composed of container components
  - facade - facade of query and usecase
  - query - query for store
  - store - value store
  - usecase - usecase
  - domain - core domain logic
- lib - shared with other projects

## Presentational Component

Presentational Component is a Stateless Component.
It only depends on props.

## Container Component

Container Component is a Statefull Component.
It depends on facade.

## Facade

Facade uses query and usecase.
It also indirectly depends on store and domains.

## Usecase

Usecase updates values of store.
It also depends on domains.

## Query

Query selects and combines values from store.
It also depends on domains.

## Store

Store has values on application scope.

## Domain

Domain has logics and structures of core business domains.

## Repository

Repository is adaptor for infrastructure.
It is mainly used for data store and api requests.
