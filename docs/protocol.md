# DAO Protocol

## Background
The Identity DAO curates a registry of identity entries on the Ethereum blockchain, such that

1. Each address is controlled by a single human identity.
2. No two addresses are controlled by the same human identity.
3. All identity metadata attributed to that address (Full name, Twitter handle, Photo, etc) corresponds to that human identity.

The DAO's protocol is intended to achieve the above functionality in a manner that is
- *Sound*: Near-0 false positive rate and very low false negative rate
- *Incentivized*: Encourages profit-seeking individuals to curate diligently in the pusuit of profit
- *High Throughput*: Can handle hundreds, and eventually thousands of proposals a day
- *Low Cost*: minimizes and distributes costs for identity verification to its marginal cost

## Overview
The DAO requires users to attach a small fee with their submissions– part of which is returned to the user upon successful submission and the remainder of which pays out correct voters. This fee not only incentivizes voters but also reduces the likelihood of spam proposals.

In order to scale the throughput of decision-making by voters (quantity) without compromising the soundndess of decision-making (quality), the Identity DAO utilizes the Genesis Protocol– which introduces stakers who can curate the proposals that voters vote on through staking.

## Genesis Protocol

The Genesis Protocol achieves holographic consensus by combining a staking game with a reputation-weighted voting game. Here is a high-level overview ([see here for the full protocol spec](https://docs.google.com/document/d/1b3UXvIDjxTVjS1nZNAn0umSY4DT5Y1yJeNHg07ny_5k/edit)).

- Identity proposals go to Queue in which they can be resolved with absolute majority.
- Upstakes and Downstakes are open during Queue.
- Proposals in Queue are scored with Confidence: the ratio of their upstakes and downstakes.
- Proposals are boosted if their Confidence is continuously above Boost Threshold for some time.
- Boosted proposals are open for finite-time voting, at the end of which they’re resolved with relative majority, given a quiet ending.
- The DAO downstakes every proposal in proportion to the average downstake in Boost.

## ID DAO Configuration

### Reponomics

Successful proposer reputation gain: 1 rep

Accepted human redeemable reputation: 99 rep

- Accepted humans will receive 99 *claimable* reputation that can only be redeemed by signing a redeem transaction with the corresponding private key.

Incorrect voter reputation loss: 33%

- This reputation is debited from incorrect voters and credited to correct voters of the same proposal

### Tokenomics

A small fee + stake will be required for all submissions to the Identity DAO. 

Proposal stake: 0.09 ETH

- Returned if proposal succeeds, sent to DAO treasury if proposal fails

Proposal fee: 0.01 ETH

- This fee is split among correct voters
