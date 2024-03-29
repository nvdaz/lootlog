import { gql } from 'apollo-server-express';

export default gql`
  directive @auth(requires: Role = USER) on FIELD_DEFINITION

  scalar Date
  scalar RegExp
  scalar ObjectID

  enum Role {
    ADMIN
    USER
    NORMAL
  }

  enum DragonType {
    SUPERIOR
    STRONG
    UNSTABLE
    WISE
    YOUNG
    OLD
    PROTECTOR
  }

  enum SlayerType {
    REVENANT
    TARANTULA
    WOLF
  }

  enum DragonRewardType {
    HELMET
    CHESTPLATE
    LEGGINGS
    BOOTS
    ASPECT_OF_THE_DRAGONS
    LEGENDARY_PET
    EPIC_PET
    DRAGON_SCALE
    DRAGON_CLAW
    DRAGON_HORN
    FRAGMENTS
  }

  enum SlayerRewardType {
    SCYTHE_BLADE
    SNAKE_RUNE
    REVENANT_CATALYST
    BEHEADED_HORROR
    SMITE_VI_BOOK
    UNDEAD_CATALYST
    PESTILENCE_RUNE
    FOUL_FLESH
    REVENANT_FLESH

    DIGESTED_MOSQUITO
    TARANTULA_TALISMAN
    FLY_SWATTER
    BANE_VI_BOOK
    SPIDER_CATALYST
    BITE_RUNE
    TOXIC_ARROW_POISON
    TARANTULA_WEB

    OVERFLUX_CAPACITOR
    GRIZZLY_BAIT
    RED_CLAW_EGG
    COUTURE_RUNE
    CRITICAL_VI_BOOK
    SPIRIT_RUNE
    HAMSTER_WHEEL
    WOLF_TOOTH
  }

  enum GolemRewardType {
    LEGENDARY_GOLEM_PET
    EPIC_GOLEM_PET
    PET_TIER_BOOST
  }

  enum RewardTestMode {
    ITEM_PACKET
    ITEM_DELTA
    CHAT_FORMATTED
    CHAT_UNFORMATTED
  }

  enum PriceType {
    FRAGMENTS
  }

  enum Modifier {
    HPB
    ENCHANTED
    REFORGED
  }

  input DragonRewardInput {
    reward: DragonRewardType!
    count: Int!
  }

  input SlayerRewardInput {
    reward: SlayerRewardType!
    count: Int!
  }

  input GolemRewardInput {
    reward: GolemRewardType!
    count: Int!
  }

  interface Reward {
    count: Int!
    appraisal: Int!
  }

  type DragonReward {
    reward: DragonRewardType!
    count: Int!
    appraisal: Int!
  }

  type SlayerReward {
    reward: SlayerRewardType!
    count: Int!
    appraisal: Int!
  }

  type GolemReward {
    reward: GolemRewardType!
    count: Int!
    appraisal: Int!
  }

  type DragonFight {
    _id: ObjectID!
    owner: ID!
    dragonType: DragonType!
    rewards: [DragonReward!]!
    lastUpdated: Date!
    eyesPlaced: Int!
    day: Int
    leaderboardPlacement: Int
    eyePrice: Int!
    revenue: Int!
    gross: Int!
  }

  type DragonOverview {
    _id: ObjectID!
    day: Date!
    revenue: Float!
    gross: Float!
    average: Int
    dragonCount: Int!
    dragonTypes: [DragonType!]!
  }

  type SlayerTask {
    _id: ObjectID!
    owner: ID!
    slayerType: SlayerType!
    rewards: [SlayerReward!]!
    tier: Int!
    revenue: Int!
    gross: Int!
  }

  type GolemFight {
    _id: ObjectID!
    owner: ID!
    rewards: [GolemReward!]!
    revenue: Int!
  }

  interface ItemProvider {
    type: String!
    test: RegExp!
    mode: RewardTestMode!
    minecraftItem: String!
    texture: String
    metadata: Int
  }

  type DragonItemProvider implements ItemProvider {
    type: String!
    test: RegExp!
    mode: RewardTestMode!
    minecraftItem: String!
    texture: String
    metadata: Int
    item: DragonRewardType!
  }

  type SlayerItemProvider implements ItemProvider {
    type: String!
    test: RegExp!
    mode: RewardTestMode!
    minecraftItem: String!
    texture: String
    metadata: Int
    item: SlayerRewardType!
  }

  type GolemItemProvider implements ItemProvider {
    type: String!
    test: RegExp!
    mode: RewardTestMode!
    minecraftItem: String!
    texture: String
    metadata: Int
    item: GolemRewardType!
  }

  type AuthChallenge {
    serverID: ID!
    token: String!
  }

  type AuthResult {
    token: String!
  }

  type SetVersionResult {
    isCurrent: Boolean!
    changelog: String
  }

  type PriceDay {
    date: Date!
    price: Float!
  }

  type IQR {
    min: Float!
    max: Float!
    avg: Float!
  }

  type Price {
    item: String!
    daily: [PriceDay]!
    iqr: IQR!
  }

  type DragonChance {
    dragonType: DragonType!
    chance: Float!
  }

  type Profit {
    date: Date!
    profit: Float!
  }

  type ModifierValue {
    modifiers: [Modifier]!
    value: Float!
  }

  type BasicUser {
    _id: ObjectID!
    username: String!
    displayName: String!
    dragons(day: Date, skip: Int, limit: Int, utcOffset: Int): [DragonFight]!
    dragonOverviews(utcOffset: Int): [DragonOverview]!
  }

  type User {
    _id: ObjectID!
    minecraft: ID!
    discord: ID!
    username: String!
    displayName: String!
    eyePrice: Int!
    dragons(day: Date, skip: Int, limit: Int, utcOffset: Int): [DragonFight]!
    dragonOverviews(utcOffset: Int): [DragonOverview]!
    notableSlayers(
      slayerType: SlayerType!
      skip: Int
      limit: Int
    ): [SlayerTask!]!
    slayerXp(slayerType: SlayerType!): Int!
  }

  type Version {
    _id: ObjectID!
    etag: ID!
    version: String!
    changes: [String!]!
    download: String
  }

  type Subscription {
    dragonAdded(owner: ID): DragonFight!
  }

  type Mutation {
    initChallenge(uuid: ID!): AuthChallenge!
    completeChallenge(token: String!): String!
    setVersion(version: String!): SetVersionResult! @auth(requires: USER)
    updateSettings(
      displayName: String
      eyePrice: String
      username: String
    ): User! @auth(requires: USER)
    addDragon(
      dragonType: DragonType!
      rewards: [DragonRewardInput!]!
      eyesPlaced: Int!
      day: Int!
      leaderboardPlacement: Int!
    ): DragonFight! @auth(requires: USER)
    addSlayer(
      slayerType: SlayerType!
      rewards: [SlayerRewardInput!]!
      tier: Int!
    ): SlayerTask! @auth(requires: USER)
    addGolem(
      rewards: [GolemRewardInput!]!
      leaderboardPlacement: Int!
    ): GolemFight!
  }

  type Query {
    currentUser: User @cacheControl(maxAge: 0) @auth(requires: USER)
    users: [BasicUser]!
    userById(id: ID!): BasicUser
    userByName(username: String): BasicUser
    dragons(skip: Int, limit: Int): [DragonFight]!
    dragonItemProviders: [DragonItemProvider]! @auth(requires: USER)
    slayerItemProviders: [SlayerItemProvider]! @auth(requires: USER)
    golemItemProviders: [GolemItemProvider]! @auth(requires: USER)
    itemProviders: [ItemProvider!]!
    prices(type: PriceType!): [Price]!
    dragonChances: [DragonChance]!
    profits: [Profit]!
    versions: [Version!]!
  }
`;
